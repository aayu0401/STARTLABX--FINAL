export type AccountType = 'startup' | 'professional';

export interface UserProfileData {
  fullName: string;
  email: string;
  accountType: AccountType;
  title?: string;
  companyName?: string;
  description?: string;
  skills?: string; // comma-separated
  industry?: string;
  stage?: string;
  fundingStatus?: string;
  availability?: string;
  experience?: string;
  preferredEquity?: number;
  hourlyRate?: number;
  website?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
  createdAt?: Date | number | string;
}
