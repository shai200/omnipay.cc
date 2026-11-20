const EVENT_ID_PATTERN = /^[A-Za-z0-9_]{1,128}$/;
const ONRAMP_SESSION_UPDATED = 'crypto.onramp_session.updated';
const FULFILLMENT_COMPLETE = 'fulfillment_complete';

export function isWebhookEventId(value: unknown): value is string {
  return typeof value === 'string' && EVENT_ID_PATTERN.test(value);
}

export type VerifiedCompletionEvent = {
  signatureVerified?: unknown;
  applied?: unknown;
  type?: unknown;
  status?: unknown;
  sessionId?: unknown;
};

// True only for the first transition onto a signature-verified completion.
// The Next.js webhook is the only writer of verifiedCompletionEventId and of
// stripe_webhook_events. This gate is what the first-purchase email calls.
export function verifiedCompletionAllowsEmail(input: {
  sessionId: string;
  beforeMarker: unknown;
  afterMarker: unknown;
  afterStatus: unknown;
  event: VerifiedCompletionEvent | undefined;
}): boolean {
  if (!isWebhookEventId(input.afterMarker)) return false;
  if (input.beforeMarker === input.afterMarker) return false;
  if (input.afterStatus !== FULFILLMENT_COMPLETE) return false;
  const event = input.event;
  if (!event) return false;
  return (
    event.signatureVerified === true &&
    event.applied === true &&
    event.type === ONRAMP_SESSION_UPDATED &&
    event.status === FULFILLMENT_COMPLETE &&
    event.sessionId === input.sessionId
  );
}
