import { createHash } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { FirebaseScrypt } from 'firebase-scrypt';

// bcrypt only uses the first 72 bytes. Hashing a fixed SHA-256 digest first
// keeps the full password (up to the auth max length) in the check.
const BCRYPT_ROUNDS = 12;
const FIREBASE_PREFIX = 'firebase-scrypt$';
const MAX_MEM_COST = 15;
const MAX_ROUNDS = 16;

export type FirebaseScryptConfig = {
  signerKey: string;
  saltSeparator: string;
  rounds: number;
  memCost: number;
};

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(prehash(password), BCRYPT_ROUNDS);
}

function prehash(password: string): string {
  return createHash('sha256').update(password, 'utf8').digest('base64');
}

export function isBcryptHash(hash: string): boolean {
  return hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$');
}

export function isFirebaseScryptHash(hash: string): boolean {
  return hash.startsWith(FIREBASE_PREFIX);
}

export function encodeFirebaseScryptHash(hash: string, salt: string): string {
  return `${FIREBASE_PREFIX}${hash}$${salt}`;
}

export function readFirebaseScryptConfig(
  env: NodeJS.ProcessEnv = process.env,
): FirebaseScryptConfig | null {
  const signerKey = env.FIREBASE_SCRYPT_SIGNER_KEY?.trim() ?? '';
  const saltSeparator = env.FIREBASE_SCRYPT_SALT_SEPARATOR?.trim() ?? '';
  const rounds = Number(env.FIREBASE_SCRYPT_ROUNDS);
  const memCost = Number(env.FIREBASE_SCRYPT_MEM_COST);
  if (!signerKey || !saltSeparator) return null;
  if (!Number.isInteger(rounds) || rounds < 1 || rounds > MAX_ROUNDS) return null;
  if (!Number.isInteger(memCost) || memCost < 1 || memCost > MAX_MEM_COST) return null;
  return { signerKey, saltSeparator, rounds, memCost };
}

let loggedMissingScrypt = false;

async function verifyFirebaseScrypt(stored: string, password: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 3 || parts[0] !== 'firebase-scrypt' || !parts[1] || !parts[2]) {
    return false;
  }
  const config = readFirebaseScryptConfig();
  if (!config) {
    if (!loggedMissingScrypt) {
      loggedMissingScrypt = true;
      console.error('Firebase scrypt parameters are not configured; legacy passwords cannot be checked');
    }
    return false;
  }
  const scrypt = new FirebaseScrypt(config);
  return scrypt.verify(password, parts[2], parts[1]);
}

// Verifies either a current bcrypt hash or a Firebase Auth scrypt hash.
// A successful legacy check is upgraded by the caller so the scrypt hash
// does not remain the password of record.
export async function verifyStoredPassword(
  hash: string,
  password: string,
  upgrade?: (nextHash: string) => Promise<void>,
): Promise<boolean> {
  if (!hash || !password) return false;

  if (isBcryptHash(hash)) {
    return bcrypt.compare(prehash(password), hash);
  }

  if (!isFirebaseScryptHash(hash)) return false;

  const ok = await verifyFirebaseScrypt(hash, password);
  if (!ok) return false;

  if (upgrade) {
    try {
      await upgrade(await hashPassword(password));
    } catch {
      console.error('Password hash upgrade failed');
    }
  }
  return true;
}
