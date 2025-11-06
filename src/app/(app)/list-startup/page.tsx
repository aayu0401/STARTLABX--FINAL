'use client';

import React from 'react';
import { ListStartupHeader } from './components/header';
import { BasicInfoCard } from './components/basic-info-card';
import { LookingForCard } from './components/looking-for-card';
import { WorkPreferencesCard } from './components/work-preferences-card';
import { AdvancedDetailsCard } from './components/advanced-details-card';
import { FormActions } from './components/form-actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { useNavigation } from '@/hooks/use-navigation';
import { useToast } from '@/hooks/use-toast';
import { createStartupListing } from '@/services/startup-listings';
import { analyticsService } from '@/services/analytics';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-screen';
import { Form } from '@/components/ui/form';

// Form schema
const listingFormSchema = z.object({
  // Basic Info
  name: z.string().min(2, "Company name must be at least 2 characters"),
  tagline: z.string().min(10, "Tagline must be at least 10 characters").max(100, "Tagline must be under 100 characters"),
  industry: z.string().min(1, "Please select an industry"),
  location: z.string().min(1, "Location is required"),
  stage: z.enum(['idea', 'mvp', 'early_revenue', 'growth', 'scaling']),
  
  // What they're looking for
  lookingFor: z.array(z.string()).min(1, "Select at least one role"),
  
  // Work preferences
  workArrangement: z.enum(['remote', 'hybrid', 'onsite', 'flexible']),
  timeCommitment: z.enum(['part_time', 'full_time', 'flexible']),
  equityMin: z.number().min(0).max(100),
  equityMax: z.number().min(0).max(100),
  
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
  linkedin: z.string().url().optional().or(z.literal('')),
  twitter: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
}).refine(data => data.equityMin <= data.equityMax, {
  message: "Minimum equity must be less than maximum equity",
  path: ["equityMax"],
});

type ListingFormValues = z.infer<typeof listingFormSchema>;


export default function ListStartupPage() {
  const { user, userProfile, loading } = useAuth();
  const { navigateTo } = useNavigation();
  const { toast } = useToast();
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      name: '',
      tagline: '',
      industry: '',
      location: '',
      stage: 'idea',
      lookingFor: [],
      workArrangement: 'flexible',
      timeCommitment: 'flexible',
      equityMin: 1,
      equityMax: 10,
      description: '',
      problemSolving: '',
      targetMarket: '',
      competitiveAdvantage: '',
      traction: '',
      teamSize: 1,
      website: '',
      linkedin: '',
      twitter: '',
      github: '',
    },
  });

  // Track form interaction
  React.useEffect(() => {
    analyticsService.trackFormInteraction('startup_listing_form', 'started');
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Please log in to list your startup.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userProfile?.accountType !== 'startup') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Only startup accounts can create listings.</p>
            <Button 
              className="mt-4" 
              onClick={() => navigateTo('/dashboard', { message: 'Redirecting...' })}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = async (data: ListingFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Track listing creation attempt
      await analyticsService.track('startup_listing_creation_started', {
        industry: data.industry,
        stage: data.stage,
        roles_count: data.lookingFor.length,
        has_advanced_details: showAdvanced && (data.description || data.problemSolving),
      });

      // Prepare data for API - clean up undefined values
      const socialLinks: any = {};
      if (data.linkedin && data.linkedin.trim()) socialLinks.linkedin = data.linkedin.trim();
      if (data.twitter && data.twitter.trim()) socialLinks.twitter = data.twitter.trim();
      if (data.github && data.github.trim()) socialLinks.github = data.github.trim();

      const listingData = {
        name: data.name.trim(),
        tagline: data.tagline.trim(),
        industry: data.industry,
        location: data.location.trim(),
        stage: data.stage,
        lookingFor: data.lookingFor as any[],
        workArrangement: data.workArrangement,
        timeCommitment: data.timeCommitment,
        equityRange: {
          min: data.equityMin,
          max: data.equityMax,
        },
        // Only include optional fields if they have values
        ...(data.description && data.description.trim() && { description: data.description.trim() }),
        ...(data.problemSolving && data.problemSolving.trim() && { problemSolving: data.problemSolving.trim() }),
        ...(data.targetMarket && data.targetMarket.trim() && { targetMarket: data.targetMarket.trim() }),
        ...(data.competitiveAdvantage && data.competitiveAdvantage.trim() && { competitiveAdvantage: data.competitiveAdvantage.trim() }),
        ...(data.traction && data.traction.trim() && { traction: data.traction.trim() }),
        ...(data.fundingStatus && { fundingStatus: data.fundingStatus }),
        ...(data.fundingAmount && { fundingAmount: data.fundingAmount }),
        ...(data.teamSize && { teamSize: data.teamSize }),
        ...(data.website && data.website.trim() && { website: data.website.trim() }),
        ...(Object.keys(socialLinks).length > 0 && { socialLinks }),
      };

      const listingId = await createStartupListing(user.uid, listingData);

      // Track successful creation
      await analyticsService.track('startup_listing_created', {
        listing_id: listingId,
        industry: data.industry,
        stage: data.stage,
      });

      toast({
        title: "Startup Listed Successfully!",
        description: "Your startup is now live and visible to potential team members.",
      });

      // Navigate to the listing or back to dashboard
      await navigateTo('/dashboard', { 
        message: 'Redirecting to dashboard...',
        trackEvent: 'post_listing_navigation'
      });

    } catch (error: any) {
      console.error('Error creating startup listing:', error);
      
      // Track error
      await analyticsService.trackError('startup_listing_creation_error', error.message, 'list_startup_form');

      toast({
        variant: "destructive",
        title: "Failed to Create Listing",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleToggle = (roleValue: string, checked: boolean) => {
    const currentRoles = form.getValues('lookingFor');
    if (checked) {
      form.setValue('lookingFor', [...currentRoles, roleValue]);
    } else {
      form.setValue('lookingFor', currentRoles.filter(role => role !== roleValue));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ListStartupHeader />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfoCard form={form as any} isSubmitting={isSubmitting} />
          <LookingForCard form={form as any} onRoleToggle={handleRoleToggle} />
          <WorkPreferencesCard form={form as any} isSubmitting={isSubmitting} />
          <AdvancedDetailsCard
            form={form as any}
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            isSubmitting={isSubmitting}
          />
          <FormActions
            isSubmitting={isSubmitting}
            onCancel={() => navigateTo('/dashboard', { message: 'Returning to dashboard...' })}
          />
        </form>
      </Form>
    </div>
  );
}