// Types for user data and KYC information

export interface UserKYCInfo {
  email: string;
  firstName: string;
  lastName: string;
  dob: {
    year: number;
    month: number;
    day: number;
  };
  ssn?: string; // Optional for security reasons - won't be stored
  address: {
    country: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

export interface ReminderPreferences {
  monthly: boolean;
  weekly: boolean;
  afterMajorDrops: boolean;
}

export interface UserData {
  email: string;
  kycInfo: Omit<UserKYCInfo, 'ssn'>; // SSN should never be stored
  reminderPreferences: ReminderPreferences;
  createdAt: number;
  updatedAt: number;
}
