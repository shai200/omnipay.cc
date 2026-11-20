import { toNextJsHandler } from 'better-auth/next-js';
import { getAuth } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Handler = (request: Request) => Promise<Response>;

function dispatch(request: Request): Promise<Response> {
  const handlers = toNextJsHandler(getAuth()) as Record<string, Handler>;
  const handler = handlers[request.method.toUpperCase()];
  if (!handler) return Promise.resolve(new Response(null, { status: 405 }));
  return handler(request);
}

export const GET = dispatch;
export const POST = dispatch;
export const PATCH = dispatch;
export const PUT = dispatch;
export const DELETE = dispatch;
