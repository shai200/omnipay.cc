import { describe, expect, it } from 'vitest';
import type { PublicProfile } from '@/lib/profile';
import { checkoutRequestBody } from '@/lib/checkout-request';
import { walletAddressForNetwork } from '@/lib/wallet';
import { deriveAuthState, ProfileRequests, settleProfileRead, type LoadedProfile } from './profile-sync';

const WALLET = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4';
const SAVED: PublicProfile = {
  first_name: 'Ada',
  source_amount: '250',
  source_currency: 'usd',
  wallet_addresses: { bitcoin: WALLET },
};

// Mirrors how AuthContext applies reads and writes to its `loaded` state,
// so the ordering can be checked without rendering React.
function harness() {
  const requests = new ProfileRequests();
  let loaded: LoadedProfile | null = null;
  return {
    requests,
    get loaded() {
      return loaded;
    },
    startRead(userId: string) {
      const token = requests.begin();
      return (profile: PublicProfile | null) => {
        loaded = settleProfileRead(loaded, { userId, profile, error: null }, !requests.isLatest(token));
      };
    },
    startWrite(userId: string) {
      const token = requests.begin();
      return (profile: PublicProfile | null) => {
        if (requests.isLatest(token)) loaded = { userId, profile, error: null };
      };
    },
    signOut() {
      requests.invalidate();
      loaded = null;
    },
  };
}

// What the buy panel would POST to /api/onramp-session for a given auth state.
function checkoutBody(sessionUserId: string | null, isPending: boolean, loaded: LoadedProfile | null) {
  const state = deriveAuthState({ isPending, sessionUserId, loaded });
  return checkoutRequestBody({
    authLoading: state.loading,
    uid: sessionUserId,
    walletAddress: walletAddressForNetwork(state.profile?.wallet_addresses, 'bitcoin'),
    sourceAmount: state.profile?.source_amount || '100',
    sourceCurrency: state.profile?.source_currency || 'usd',
    destinationCurrency: 'btc',
    destinationNetwork: 'bitcoin',
  });
}

describe('deriveAuthState', () => {
  it('is loading while the session is pending', () => {
    expect(deriveAuthState({ isPending: true, sessionUserId: null, loaded: null }).loading).toBe(true);
  });

  it('is not loading once the session is known to be signed out', () => {
    expect(deriveAuthState({ isPending: false, sessionUserId: null, loaded: null })).toEqual({
      profile: null,
      profileError: null,
      loading: false,
    });
  });

  it('stays loading for a signed-in user until their profile has been read', () => {
    expect(deriveAuthState({ isPending: false, sessionUserId: 'u1', loaded: null }).loading).toBe(true);
    const loaded = { userId: 'u1', profile: SAVED, error: null };
    expect(deriveAuthState({ isPending: false, sessionUserId: 'u1', loaded })).toEqual({
      profile: SAVED,
      profileError: null,
      loading: false,
    });
  });

  it("never exposes another user's profile", () => {
    const loaded = { userId: 'u1', profile: SAVED, error: 'x' };
    expect(deriveAuthState({ isPending: false, sessionUserId: 'u2', loaded })).toEqual({
      profile: null,
      profileError: null,
      loading: true,
    });
    expect(deriveAuthState({ isPending: false, sessionUserId: null, loaded }).profile).toBeNull();
  });
});

describe('profile read/write ordering', () => {
  it('keeps the sign-up profile when the session read finishes after the write', () => {
    const auth = harness();
    const finishRead = auth.startRead('u1'); // session appears, read starts (no profile row yet)
    const finishWrite = auth.startWrite('u1'); // sign-up saves the profile
    finishWrite(SAVED);
    finishRead(null); // the stale read lands last
    expect(auth.loaded?.profile).toEqual(SAVED);
  });

  it('keeps the sign-up profile when the session read finishes first', () => {
    const auth = harness();
    const finishRead = auth.startRead('u1');
    const finishWrite = auth.startWrite('u1');
    finishRead(null);
    finishWrite(SAVED);
    expect(auth.loaded?.profile).toEqual(SAVED);
  });

  it('settles the first load even if a newer request is still in flight', () => {
    const auth = harness();
    const finishRead = auth.startRead('u1');
    auth.startWrite('u1'); // never finishes (for example the request failed)
    finishRead(SAVED);
    expect(deriveAuthState({ isPending: false, sessionUserId: 'u1', loaded: auth.loaded }).loading).toBe(false);
  });

  it('does not let a read from before sign-out show up for the next user', () => {
    const auth = harness();
    const finishRead = auth.startRead('u1');
    auth.signOut();
    finishRead(SAVED);
    expect(deriveAuthState({ isPending: false, sessionUserId: 'u2', loaded: auth.loaded }).profile).toBeNull();
  });

  it('asks for exactly one checkout session across the sign-up race', () => {
    const auth = harness();
    const bodies: (string | null)[] = [];
    const snapshot = () => bodies.push(checkoutBody('u1', false, auth.loaded));

    const finishRead = auth.startRead('u1');
    snapshot(); // profile not read yet: no checkout
    const finishWrite = auth.startWrite('u1');
    finishWrite(SAVED);
    snapshot(); // home page with the saved wallet and amount
    finishRead(null);
    snapshot(); // stale read lands: must not change the request

    const distinct = new Set(bodies.filter((body) => body !== null));
    expect(bodies[0]).toBeNull();
    expect(distinct.size).toBe(1);
    expect(JSON.parse([...distinct][0]!)).toMatchObject({ walletAddress: WALLET, sourceAmount: '250' });
  });
});

describe('checkoutRequestBody', () => {
  const base = { uid: 'u1', walletAddress: WALLET, sourceAmount: '100', sourceCurrency: 'usd' };

  it('is null while auth is loading or signed out', () => {
    expect(checkoutRequestBody({ ...base, authLoading: true })).toBeNull();
    expect(checkoutRequestBody({ ...base, authLoading: false, uid: null })).toBeNull();
  });

  it('is identical for equal inputs, so a re-render does not create another session', () => {
    expect(checkoutRequestBody({ ...base, authLoading: false })).toBe(
      checkoutRequestBody({ ...base, authLoading: false }),
    );
  });

  it('changes when the wallet or amount changes', () => {
    const first = checkoutRequestBody({ ...base, authLoading: false });
    expect(checkoutRequestBody({ ...base, authLoading: false, walletAddress: undefined })).not.toBe(first);
    expect(checkoutRequestBody({ ...base, authLoading: false, sourceAmount: '25.50' })).not.toBe(first);
  });

  it('does not include the user id in the request body', () => {
    expect(checkoutRequestBody({ ...base, authLoading: false })).not.toContain('u1');
  });
});
