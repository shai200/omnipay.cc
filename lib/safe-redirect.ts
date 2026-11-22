// Only same-site relative paths are allowed as post-login destinations, so a
// crafted ?next= link cannot send a freshly signed-in user to another site.
export function safeNextPath(value: string | null | undefined, fallback = '/'): string {
  if (!value || typeof value !== 'string') return fallback;
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return fallback;
  if (/[\u0000-\u001f\u007f]/.test(value) || value.includes('\\')) return fallback;
  if (value.startsWith('/api/') || value.startsWith('/auth/')) return fallback;
  return value;
}
