'use server';

import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { z } from 'zod';

const UserProfileSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  fullName: z.string().min(1),
  accountType: z.enum(['startup', 'professional']),
  title: z.string().optional(),
  skills: z.string().optional(),
  availability: z.enum(['freelance', 'equity', 'cofounder']).optional(),
});

type UserProfile = z.infer<typeof UserProfileSchema>;

export async function createUserProfile(profile: Omit<UserProfile, 'createdAt'>) {
  try {
    // Validate the profile data on the server
    const validatedProfile = UserProfileSchema.parse(profile);

    const userRef = doc(db, 'users', validatedProfile.uid);
    await setDoc(userRef, {
      ...validatedProfile,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating user profile in Firestore:', error);
    if (error instanceof z.ZodError) {
      throw new Error('Invalid profile data.');
    }
    throw new Error('Failed to save user profile.');
  }
}
