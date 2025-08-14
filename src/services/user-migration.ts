import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { createUserProfile } from './firestore';

export async function migrateUserIfNeeded(uid: string) {
  try {
    // Check if user exists in new structure
    const mainUserRef = doc(db, 'users', uid);
    const mainUserDoc = await getDoc(mainUserRef);
    
    if (mainUserDoc.exists()) {
      console.log('User already exists in new structure');
      return true;
    }
    
    console.log('User not found in new structure, checking for legacy data...');
    
    // If no main user doc exists, this might be a new user
    // or we need to check if there's any legacy data structure
    
    return false;
  } catch (error) {
    console.error('Error during user migration:', error);
    return false;
  }
}

export async function createBasicUserProfile(user: any) {
  try {
    // Create a basic profile for users who don't have one
    const basicProfile = {
      uid: user.uid,
      email: user.email || '',
      fullName: user.displayName || user.email?.split('@')[0] || 'User',
      accountType: 'startup' as const, // Default to startup
      createdAt: new Date(),
    };

    // Create minimal entry in main users collection (auth lookup only)
    const mainUserRef = doc(db, 'users', user.uid);
    await setDoc(mainUserRef, {
      uid: user.uid,
      accountType: basicProfile.accountType,
      createdAt: new Date(),
    });

    // Create in startups collection
    const startupRef = doc(db, 'startups', user.uid);
    await setDoc(startupRef, basicProfile);

    console.log('Created basic user profile');
    return basicProfile;
  } catch (error) {
    console.error('Error creating basic user profile:', error);
    return null;
  }
}