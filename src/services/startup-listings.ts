import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, addDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { z } from 'zod';

// Helper function to recursively clean undefined values from objects
function cleanObjectRecursively(obj: any): any {
  if (obj === null || obj === undefined) {
    return undefined;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(cleanObjectRecursively).filter(item => item !== undefined);
  }
  
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = cleanObjectRecursively(value);
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    }
    // Don't return empty objects
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }
  
  return obj;
}

// Startup listing schema
const StartupListingSchema = z.object({
  id: z.string().optional(),
  founderId: z.string(),
  
  // Basic Info
  name: z.string().min(2, "Company name must be at least 2 characters"),
  tagline: z.string().min(10, "Tagline must be at least 10 characters").max(100, "Tagline must be under 100 characters"),
  industry: z.string().min(1, "Please select an industry"),
  location: z.string().min(1, "Location is required"),
  stage: z.enum(['idea', 'mvp', 'early_revenue', 'growth', 'scaling']),
  
  // What they're looking for
  lookingFor: z.array(z.enum(['cofounder', 'technical_lead', 'designer', 'marketer', 'sales', 'advisor', 'developer', 'other'])).min(1, "Select at least one role"),
  
  // Work preferences
  workArrangement: z.enum(['remote', 'hybrid', 'onsite', 'flexible']),
  timeCommitment: z.enum(['part_time', 'full_time', 'flexible']),
  equityRange: z.object({
    min: z.number().min(0).max(100),
    max: z.number().min(0).max(100),
  }).refine(data => data.min <= data.max, "Minimum equity must be less than maximum"),
  
  // Optional detailed info
  description: z.string().optional(),
  problemSolving: z.string().optional(),
  targetMarket: z.string().optional(),
  competitiveAdvantage: z.string().optional(),
  traction: z.string().optional(),
  fundingStatus: z.enum(['bootstrapped', 'pre_seed', 'seed', 'series_a', 'series_b', 'later']).optional(),
  fundingAmount: z.number().optional(),
  teamSize: z.number().optional(),
  website: z.string().url().optional().or(z.literal('')),
  socialLinks: z.object({
    linkedin: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    github: z.string().url().optional().or(z.literal('')),
  }).optional(),
  
  // System fields
  status: z.enum(['draft', 'active', 'paused', 'closed']).default('active'),
  featured: z.boolean().default(false),
  views: z.number().default(0),
  applications: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
  expiresAt: z.date().optional(),
});

export type StartupListing = z.infer<typeof StartupListingSchema>;

// Create a new startup listing
export async function createStartupListing(
  founderId: string, 
  data: Omit<StartupListing, 'id' | 'founderId' | 'status' | 'featured' | 'views' | 'applications' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const listing: Omit<StartupListing, 'id'> = {
      ...data,
      founderId,
      status: 'active',
      featured: false,
      views: 0,
      applications: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Validate the data
    const validatedListing = StartupListingSchema.omit({ id: true }).parse(listing);

    // Deep clean undefined values, especially in nested objects like socialLinks
    const cleanListing = cleanObjectRecursively(validatedListing);

    const listingsRef = collection(db, 'startup_listings');
    const docRef = await addDoc(listingsRef, cleanListing);

    console.log('Created startup listing with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating startup listing:', error);
    if (error instanceof z.ZodError) {
      throw new Error('Invalid listing data: ' + error.errors.map(e => e.message).join(', '));
    }
    throw error;
  }
}

// Get a startup listing by ID
export async function getStartupListing(listingId: string): Promise<StartupListing | null> {
  try {
    const listingRef = doc(db, 'startup_listings', listingId);
    const listingDoc = await getDoc(listingRef);
    
    if (!listingDoc.exists()) {
      return null;
    }
    
    const data = listingDoc.data();
    return StartupListingSchema.parse({
      ...data,
      id: listingDoc.id,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      expiresAt: data.expiresAt?.toDate(),
    });
  } catch (error) {
    console.error('Error fetching startup listing:', error);
    return null;
  }
}

// Get all listings by a founder
export async function getFounderListings(founderId: string): Promise<StartupListing[]> {
  try {
    const listingsRef = collection(db, 'startup_listings');
    const q = query(
      listingsRef, 
      where('founderId', '==', founderId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return StartupListingSchema.parse({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        expiresAt: data.expiresAt?.toDate(),
      });
    });
  } catch (error) {
    console.error('Error fetching founder listings:', error);
    return [];
  }
}

// Get public listings for browsing
export async function getPublicListings(options?: {
  industry?: string;
  stage?: string;
  location?: string;
  limitCount?: number;
}): Promise<StartupListing[]> {
  try {
    const listingsRef = collection(db, 'startup_listings');
    let q = query(
      listingsRef,
      where('status', '==', 'active'),
      orderBy('featured', 'desc'),
      orderBy('createdAt', 'desc')
    );

    if (options?.limitCount) {
      q = query(q, limit(options.limitCount));
    }

    const querySnapshot = await getDocs(q);
    
    let listings = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return StartupListingSchema.parse({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        expiresAt: data.expiresAt?.toDate(),
      });
    });

    // Client-side filtering for complex queries
    if (options?.industry) {
      listings = listings.filter(listing => listing.industry === options.industry);
    }
    if (options?.stage) {
      listings = listings.filter(listing => listing.stage === options.stage);
    }
    if (options?.location) {
      listings = listings.filter(listing => 
        listing.location.toLowerCase().includes(options.location!.toLowerCase())
      );
    }

    return listings;
  } catch (error) {
    console.error('Error fetching public listings:', error);
    return [];
  }
}

// Update a startup listing
export async function updateStartupListing(
  listingId: string,
  founderId: string,
  updates: Partial<Omit<StartupListing, 'id' | 'founderId' | 'createdAt'>>
): Promise<void> {
  try {
    // Verify ownership
    const existing = await getStartupListing(listingId);
    if (!existing || existing.founderId !== founderId) {
      throw new Error('Listing not found or access denied');
    }

    const listingRef = doc(db, 'startup_listings', listingId);
    await updateDoc(listingRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating startup listing:', error);
    throw error;
  }
}

// Delete a startup listing
export async function deleteStartupListing(listingId: string, founderId: string): Promise<void> {
  try {
    // Verify ownership
    const existing = await getStartupListing(listingId);
    if (!existing || existing.founderId !== founderId) {
      throw new Error('Listing not found or access denied');
    }

    const listingRef = doc(db, 'startup_listings', listingId);
    await deleteDoc(listingRef);
  } catch (error) {
    console.error('Error deleting startup listing:', error);
    throw error;
  }
}

// Increment view count
export async function incrementListingViews(listingId: string): Promise<void> {
  try {
    const listingRef = doc(db, 'startup_listings', listingId);
    const listing = await getDoc(listingRef);
    
    if (listing.exists()) {
      const currentViews = listing.data().views || 0;
      await updateDoc(listingRef, {
        views: currentViews + 1,
      });
    }
  } catch (error) {
    console.error('Error incrementing listing views:', error);
  }
}

export { StartupListingSchema };