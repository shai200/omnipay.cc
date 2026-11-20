import { adminAuth } from '@/lib/firebase-admin';

export async function verifyBearerUid(request: Request): Promise<string | null> {
  const header = request.headers.get('authorization');
  if (!header) return null;

  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  if (!match) return null;

  try {
    const decoded = await adminAuth.verifyIdToken(match[1]);
    if (!decoded || typeof decoded.uid !== 'string' || decoded.uid.length === 0) {
      return null;
    }
    return decoded.uid;
  } catch {
    return null;
  }
}
