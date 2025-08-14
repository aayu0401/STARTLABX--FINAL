import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { z } from 'zod';

// Minimal user schema for auth lookup
const AuthUserSchema = z.object({
  uid: z.string().min(1),
  accountType: z.enum(['startup', 'professional']),
  createdAt: z.date().optional(),
});

// Base user schema for full profiles
const BaseUserSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().min(1),
  accountType: z.enum(['startup', 'professional']),
  createdAt: z.date().optional(),
});

// Startup user schema
const StartupUserSchema = BaseUserSchema.extend({
  accountType: z.literal('startup'),
  companyName: z.string().optional(),
  industry: z.string().optional(),
  stage: z.enum(['idea', 'mvp', 'early_revenue', 'growth']).optional(),
  description: z.string().optional(),
  website: z.string().url().optional(),
  fundingStatus: z.enum(['bootstrapped', 'seed', 'series_a', 'series_b', 'later']).optional(),
});

// Professional user schema
const ProfessionalUserSchema = BaseUserSchema.extend({
  accountType: z.literal('professional'),
  title: z.string().min(1),
  skills: z.string().min(1),
  availability: z.enum(['freelance', 'equity', 'cofounder']),
  experience: z.enum(['junior', 'mid', 'senior', 'lead', 'executive']).optional(),
  portfolio: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  preferredEquity: z.number().min(0).max(100).optional(),
  hourlyRate: z.number().min(0).optional(),
});

// Union type for all user profiles
const UserProfileSchema = z.discriminatedUnion('accountType', [
  StartupUserSchema,
  ProfessionalUserSchema,
]);

type AuthUser = z.infer<typeof AuthUserSchema>;
type BaseUser = z.infer<typeof BaseUserSchema>;
type StartupUser = z.infer<typeof StartupUserSchema>;
type ProfessionalUser = z.infer<typeof ProfessionalUserSchema>;
type UserProfile = z.infer<typeof UserProfileSchema>;

// Get collection name based on user type
function getCollectionName(accountType: 'startup' | 'professional'): string {
  return accountType === 'startup' ? 'startups' : 'professionals';
}

export async function createUserProfile(profile: Omit<UserProfile, 'createdAt'>) {
  console.log({profile});
  try {
    // Validate the profile data
    const validatedProfile = UserProfileSchema.parse(profile);

    // Filter out undefined values
    const cleanProfile = Object.fromEntries(
      Object.entries(validatedProfile).filter(([_, value]) => value !== undefined)
    );

    // Get the appropriate collection based on user type
    const collectionName = getCollectionName(validatedProfile.accountType);
    const userRef = doc(db, collectionName, validatedProfile.uid);
    
    await setDoc(userRef, {
      ...cleanProfile,
      createdAt: new Date(),
    });

    // Also create a minimal reference in the main users collection for auth lookup
    const mainUserRef = doc(db, 'users', validatedProfile.uid);
    await setDoc(mainUserRef, {
      uid: validatedProfile.uid,
      accountType: validatedProfile.accountType,
      createdAt: new Date(),
    });

  } catch (error) {
    console.error('Error creating user profile in Firestore:', error);
    if (error instanceof z.ZodError) {
      throw new Error('Invalid profile data.');
    }
    throw error;
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    // First, get the basic user info to determine account type
    const mainUserRef = doc(db, 'users', uid);
    const mainUserDoc = await getDoc(mainUserRef);
    
    if (!mainUserDoc.exists()) {
      console.log('No user document found in main users collection');
      return null;
    }
    
    const userData = mainUserDoc.data() as AuthUser;
    console.log('User data from main collection:', userData);
    
    const collectionName = getCollectionName(userData.accountType);
    console.log('Looking in collection:', collectionName);
    
    // Get the full profile from the specific collection
    const userRef = doc(db, collectionName, uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.log('No user profile found in specific collection');
      return null;
    }
    
    const profileData = userDoc.data();
    console.log('Profile data from specific collection:', profileData);
    return UserProfileSchema.parse(profileData);
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Legacy function for backward compatibility
export async function createLegacyUserProfile(profile: {
  uid: string;
  email: string;
  fullName: string;
  accountType: 'startup' | 'professional';
  title?: string;
  skills?: string;
  availability?: 'freelance' | 'equity' | 'cofounder';
}) {
  // Convert legacy format to new format
  if (profile.accountType === 'professional') {
    const professionalProfile: Omit<ProfessionalUser, 'createdAt'> = {
      uid: profile.uid,
      email: profile.email,
      fullName: profile.fullName,
      accountType: 'professional',
      title: profile.title || 'Professional',
      skills: profile.skills || '',
      availability: profile.availability || 'equity',
    };
    return createUserProfile(professionalProfile);
  } else {
    const startupProfile: Omit<StartupUser, 'createdAt'> = {
      uid: profile.uid,
      email: profile.email,
      fullName: profile.fullName,
      accountType: 'startup',
    };
    return createUserProfile(startupProfile);
  }
}

export type { BaseUser, StartupUser, ProfessionalUser, UserProfile };
