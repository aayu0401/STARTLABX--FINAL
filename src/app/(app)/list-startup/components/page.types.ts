import { z } from 'zod';

// Mirror the schema fields used in page.tsx (keep in sync manually for now)
export const listingFormSchema = z.object({
  name: z.string().min(2),
  tagline: z.string().min(10).max(100),
  industry: z.string().min(1),
  location: z.string().min(1),
  stage: z.enum(['idea', 'mvp', 'early_revenue', 'growth', 'scaling']),
  lookingFor: z.array(z.string()).min(1),
  workArrangement: z.enum(['remote', 'hybrid', 'onsite', 'flexible']),
  timeCommitment: z.enum(['part_time', 'full_time', 'flexible']),
  equityMin: z.number().min(0).max(100),
  equityMax: z.number().min(0).max(100),
  description: z.string().optional(),
  problemSolving: z.string().optional(),
  targetMarket: z.string().optional(),
  competitiveAdvantage: z.string().optional(),
  traction: z.string().optional(),
  fundingStatus: z.enum(['bootstrapped', 'pre_seed', 'seed', 'series_a', 'series_b', 'later']).optional(),
  fundingAmount: z.number().optional(),
  teamSize: z.number().optional(),
  website: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
}).refine(data => data.equityMin <= data.equityMax, {
  message: 'Minimum equity must be less than maximum equity',
  path: ['equityMax'],
});

export type ListingFormValues = z.infer<typeof listingFormSchema>;
