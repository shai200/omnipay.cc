// Shared by the auth config and the sign-in pages so the Google button is
// only shown when the provider is actually configured.
export function googleCredentials(
  env: NodeJS.ProcessEnv = process.env,
): { clientId: string; clientSecret: string } | undefined {
  const clientId = env.GOOGLE_CLIENT_ID?.trim() ?? '';
  const clientSecret = env.GOOGLE_CLIENT_SECRET?.trim() ?? '';
  if (!clientId || !clientSecret) return undefined;
  return { clientId, clientSecret };
}

export function googleSignInEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return googleCredentials(env) !== undefined;
}
