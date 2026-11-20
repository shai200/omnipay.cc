export type FirebaseAuthExport = {
  uid: string;
  email?: string | null;
  emailVerified?: boolean;
  displayName?: string | null;
  photoURL?: string | null;
  disabled?: boolean;
  passwordHash?: string | null;
  passwordSalt?: string | null;
  providerData?: Array<{
    providerId?: string | null;
    uid?: string | null;
  }>;
  createdAt?: string | null;
};

export type FirestoreDocExport = {
  id: string;
  data: Record<string, unknown>;
};

export type FirebaseSnapshot = {
  exportedAt: string;
  authUsers: FirebaseAuthExport[];
  users: FirestoreDocExport[];
  onrampSessions: FirestoreDocExport[];
  webhookEvents: FirestoreDocExport[];
  onrampEvents: FirestoreDocExport[];
};

export type ImportCounts = {
  users: number;
  accounts: number;
  profiles: number;
  sessions: number;
  webhookEvents: number;
  legacyEvents: number;
  skippedUsers: number;
  orphanSessions: number;
};
