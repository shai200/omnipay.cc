import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import admin from 'firebase-admin';
import { getDb, closeDb } from '@/lib/db/client';
import { importFirebaseSnapshot } from '@/lib/migrate/import-firebase';
import {
  assertExportAllowed,
  assertImportAllowed,
  assertMigrationFilePath,
} from '@/lib/migrate/safety';
import type { FirebaseAuthExport, FirebaseSnapshot, FirestoreDocExport } from '@/lib/migrate/types';

type Command = 'export' | 'import';

function arg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function usage(): never {
  console.error('Usage: npm run migrate:firebase -- export --out migration-data/export.json');
  console.error('       npm run migrate:firebase -- import --in migration-data/export.json --confirm-host <db-host>');
  process.exit(1);
}

function command(): Command {
  const value = process.argv[2];
  if (value === 'export' || value === 'import') return value;
  usage();
}

function normalizeValue(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    const date = value.toDate();
    return date instanceof Date ? date.toISOString() : null;
  }
  if (Array.isArray(value)) return value.map((item) => normalizeValue(item));
  if (value && typeof value === 'object') {
    const next: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      next[key] = normalizeValue(child);
    }
    return next;
  }
  return value;
}

async function readCollection(name: string): Promise<FirestoreDocExport[]> {
  const docs: FirestoreDocExport[] = [];
  let query = admin.firestore().collection(name).orderBy(admin.firestore.FieldPath.documentId()).limit(500);
  for (;;) {
    const page = await query.get();
    if (page.empty) break;
    for (const doc of page.docs) {
      const data = normalizeValue(doc.data()) as Record<string, unknown>;
      docs.push({ id: doc.id, data });
    }
    const last = page.docs[page.docs.length - 1];
    if (!last || page.size < 500) break;
    query = admin.firestore().collection(name).orderBy(admin.firestore.FieldPath.documentId()).startAfter(last.id).limit(500);
  }
  return docs;
}

function initFirebase(): void {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT is not set');
  }
  const serviceAccount = JSON.parse(serviceAccountJson) as { project_id?: string };
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
    });
  }
}

async function exportFirebase(outPath: string): Promise<void> {
  assertExportAllowed(process.env.ALLOW_DATA_MIGRATION);
  initFirebase();
  const authUsers: FirebaseAuthExport[] = [];
  let pageToken: string | undefined;
  do {
    const page = await admin.auth().listUsers(1000, pageToken);
    for (const record of page.users) {
      authUsers.push({
        uid: record.uid,
        email: record.email ?? null,
        emailVerified: record.emailVerified,
        displayName: record.displayName ?? null,
        photoURL: record.photoURL ?? null,
        disabled: record.disabled,
        passwordHash: record.passwordHash ?? null,
        passwordSalt: record.passwordSalt ?? null,
        providerData: record.providerData.map((provider) => ({
          providerId: provider.providerId,
          uid: provider.uid,
        })),
        createdAt: record.metadata.creationTime ?? null,
      });
    }
    pageToken = page.pageToken;
  } while (pageToken);

  const snapshot: FirebaseSnapshot = {
    exportedAt: new Date().toISOString(),
    authUsers,
    users: await readCollection('users'),
    onrampSessions: await readCollection('onramp_sessions'),
    webhookEvents: await readCollection('stripe_webhook_events'),
    onrampEvents: await readCollection('onramp_events'),
  };

  await mkdir(path.dirname(outPath), { recursive: true, mode: 0o700 });
  await writeFile(outPath, JSON.stringify(snapshot), { mode: 0o600 });
  console.log('Firebase export written', {
    authUsers: snapshot.authUsers.length,
    users: snapshot.users.length,
    onrampSessions: snapshot.onrampSessions.length,
    webhookEvents: snapshot.webhookEvents.length,
    onrampEvents: snapshot.onrampEvents.length,
  });
}

async function importToPostgres(inPath: string): Promise<void> {
  const { host } = assertImportAllowed({
    allowFlag: process.env.ALLOW_DATA_MIGRATION,
    databaseUrl: process.env.DATABASE_URL,
    confirmHost: arg('--confirm-host'),
  });
  const { readFile } = await import('node:fs/promises');
  const snapshot = JSON.parse(await readFile(inPath, 'utf8')) as FirebaseSnapshot;
  if (!snapshot || !Array.isArray(snapshot.authUsers) || !Array.isArray(snapshot.users)) {
    throw new Error('Export file is not a Firebase snapshot');
  }
  console.log('Importing into database host', host);
  const counts = await importFirebaseSnapshot(getDb(), snapshot);
  console.log('Firebase import finished', counts);
}

async function main(): Promise<void> {
  const action = command();
  const fileFlag = action === 'export' ? '--out' : '--in';
  const fileArg = arg(fileFlag);
  if (!fileArg) usage();
  const filePath = assertMigrationFilePath(fileArg, process.cwd());
  if (action === 'export') {
    await exportFirebase(filePath);
  } else {
    await importToPostgres(filePath);
  }
}

main()
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Migration failed';
    console.error(message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDb().catch(() => undefined);
  });
