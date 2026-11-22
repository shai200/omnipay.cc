// The body the buy widget posts to /api/onramp-session, or null while it must
// not create a Stripe onramp session yet. Every call creates a new Stripe
// session, so the widget keys its effect on this string: equal inputs (for
// example a profile object replaced by a save with the same values) never
// create a second session, and nothing is created while auth is still loading
// (the defaults shown then would be replaced as soon as the profile arrives).
export function checkoutRequestBody(input: {
  authLoading: boolean;
  uid: string | null | undefined;
  walletAddress?: string;
  sourceAmount?: string;
  sourceCurrency?: string;
  destinationCurrency?: string;
  destinationNetwork?: string;
}): string | null {
  if (input.authLoading || !input.uid) return null;
  return JSON.stringify({
    walletAddress: input.walletAddress,
    sourceAmount: input.sourceAmount,
    sourceCurrency: input.sourceCurrency,
    destinationCurrency: input.destinationCurrency,
    destinationNetwork: input.destinationNetwork,
  });
}
