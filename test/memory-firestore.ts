import { vi } from 'vitest';

type Doc = Record<string, unknown>;

type Sentinel =
  | { __op: 'serverTimestamp' }
  | { __op: 'arrayUnion'; value: unknown };

function isSentinel<Op extends Sentinel['__op']>(
  value: unknown,
  op: Op,
): value is Extract<Sentinel, { __op: Op }> {
  return Boolean(value) && typeof value === 'object' && (value as Sentinel).__op === op;
}

function clone<T>(value: T): T {
  if (value === undefined) return value;
  return JSON.parse(JSON.stringify(value)) as T;
}

function applyFields(target: Doc, data: Doc) {
  for (const [key, value] of Object.entries(data)) {
    if (isSentinel(value, 'arrayUnion')) {
      const current = Array.isArray(target[key]) ? (target[key] as unknown[]) : [];
      target[key] = [...current, clone(value.value)];
    } else if (isSentinel(value, 'serverTimestamp')) {
      target[key] = 'SERVER_TIMESTAMP';
    } else {
      target[key] = clone(value);
    }
  }
}

export function createMemoryDb() {
  const users = new Map<string, Doc>();
  const sessions = new Map<string, Doc>();
  const events = new Map<string, Doc>();
  const reads: string[] = [];
  const verifyIdToken = vi.fn();
  let autoId = 0;

  function storeFor(name: string): Map<string, Doc> {
    if (name === 'users') return users;
    if (name === 'onramp_sessions') return sessions;
    if (name === 'onramp_events') return events;
    throw new Error(`unexpected collection ${name}`);
  }

  function makeRef(collectionName: string, id: string) {
    const store = storeFor(collectionName);
    return {
      id,
      async get() {
        reads.push(`${collectionName}/${id}`);
        const data = store.get(id);
        return {
          exists: data !== undefined,
          data: () => (data ? clone(data) : undefined),
        };
      },
      async set(data: Doc, options?: { merge?: boolean }) {
        if (options?.merge && store.has(id)) {
          const next = { ...store.get(id)! };
          applyFields(next, data);
          store.set(id, next);
          return;
        }
        const next: Doc = {};
        applyFields(next, data);
        store.set(id, next);
      },
      async update(data: Doc) {
        if (!store.has(id)) {
          throw new Error(`missing ${collectionName}/${id}`);
        }
        const next = { ...store.get(id)! };
        applyFields(next, data);
        store.set(id, next);
      },
    };
  }

  const db = {
    collection(name: string) {
      return {
        doc(id?: string) {
          return makeRef(name, id ?? `gen-${autoId++}`);
        },
        async add(data: Doc) {
          const ref = this.doc();
          await ref.set(data);
          return { id: ref.id };
        },
      };
    },
    async runTransaction<T>(fn: (tx: {
      get: (ref: { get: () => Promise<unknown> }) => Promise<unknown>;
      set: (ref: { set: (data: Doc, options?: { merge?: boolean }) => Promise<void> }, data: Doc, options?: { merge?: boolean }) => Promise<void>;
      update: (ref: { update: (data: Doc) => Promise<void> }, data: Doc) => Promise<void>;
    }) => Promise<T>): Promise<T> {
      const tx = {
        get: (ref: { get: () => Promise<unknown> }) => ref.get(),
        set: (
          ref: { set: (data: Doc, options?: { merge?: boolean }) => Promise<void> },
          data: Doc,
          options?: { merge?: boolean },
        ) => ref.set(data, options),
        update: (ref: { update: (data: Doc) => Promise<void> }, data: Doc) => ref.update(data),
      };
      return fn(tx);
    },
  };

  return {
    db,
    auth: { verifyIdToken },
    users,
    sessions,
    events,
    reads,
    reset() {
      users.clear();
      sessions.clear();
      events.clear();
      reads.length = 0;
      verifyIdToken.mockReset();
    },
  };
}

export type MemoryDb = ReturnType<typeof createMemoryDb>;

const GLOBAL_KEY = Symbol.for('omnipay.memoryDb');

export function getMemoryDb(): MemoryDb {
  const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: MemoryDb };
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = createMemoryDb();
  }
  return g[GLOBAL_KEY];
}
