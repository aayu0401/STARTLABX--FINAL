'use server';

import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

type UserProfile = {
  uid: string;
  email: string;
  fullName: string;
  accountType: 'startup' | 'professional';
  title?: string;
  skills?: string;
  availability?: 'freelance' | 'equity' | 'cofounder';
  createdAt: Date;
};

export async function createUserProfile(profile: Omit<UserProfile, 'createdAt'>) {
  try {
    const userRef = doc(db, 'users', profile.uid);
    await setDoc(userRef, {
      ...profile,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating user profile in Firestore:', error);
    throw new Error('Failed to save user profile.');
  }
}
