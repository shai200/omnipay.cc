import { eq } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { getDb } from '@/lib/db/client';
import { user } from '@/lib/db/schema';

export async function getRequestUserId(request: Request): Promise<string | null> {
  try {
    const session = await getAuth().api.getSession({ headers: request.headers });
    const userId = session?.user?.id;
    if (!userId) return null;
    const [row] = await getDb()
      .select({ disabled: user.disabled })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    if (!row || row.disabled) return null;
    return userId;
  } catch {
    console.error('Session lookup failed');
    return null;
  }
}
