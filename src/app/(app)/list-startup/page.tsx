'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { useNavigation } from '@/hooks/use-navigation';
import { useToast } from '@/hooks/use-toast';
import { createStartupListing } from '@/services/startup-listings';
import { analyticsService } from '@/services/analytics';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Building2, 
  MapPin, 
  Users, 
  Target, 
  Briefcase,
  ChevronDown,
  ChevronUp,
  Plus,
  Loader2,
  Rocket,
  Globe,
  DollarSign
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-screen';
import { LocationAutocomplete } from '@/components/ui/location-autocomplete';

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

const industries = [
  'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Real Estate',
  'Food & Beverage', 'Transportation', 'Energy', 'Entertainment', 'Gaming',
  'Social Impact', 'Hardware', 'AI/ML', 'Blockchain', 'SaaS', 'Mobile Apps', 'Other'
];

const roleOptions = [
  { value: 'cofounder', label: 'Co-founder' },
  { value: 'technical_lead', label: 'Technical Lead' },
  { value: 'designer', label: 'Designer' },
  { value: 'marketer', label: 'Marketer' },
  { value: 'sales', label: 'Sales' },
  { value: 'advisor', label: 'Advisor' },
  { value: 'developer', label: 'Developer' },
  { value: 'other', label: 'Other' },
];

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
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">List Your Startup</h1>
        <p className="text-muted-foreground mt-2">
          Connect with talented professionals ready to join your team for equity
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Tell us about your startup and what makes it unique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Acme Inc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <LocationAutocomplete
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="e.g., San Francisco, CA"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        Search for your city or click the location button to use your current location
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Making AI accessible to every business" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A brief, compelling description of what your startup does (10-100 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry.toLowerCase().replace(/\s+/g, '_')}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Stage *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="idea">Idea Stage</SelectItem>
                          <SelectItem value="mvp">MVP/Prototype</SelectItem>
                          <SelectItem value="early_revenue">Early Revenue</SelectItem>
                          <SelectItem value="growth">Growth Stage</SelectItem>
                          <SelectItem value="scaling">Scaling</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* What You're Looking For */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                What You're Looking For
              </CardTitle>
              <CardDescription>
                Select all the roles you're looking to fill
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="lookingFor"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {roleOptions.map((role) => (
                        <FormField
                          key={role.value}
                          control={form.control}
                          name="lookingFor"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={role.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(role.value)}
                                    onCheckedChange={(checked) => 
                                      handleRoleToggle(role.value, checked as boolean)
                                    }
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {role.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Work Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Work Preferences
              </CardTitle>
              <CardDescription>
                Define the working arrangement and equity range
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="workArrangement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Arrangement</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select arrangement" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="remote">Remote</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                          <SelectItem value="onsite">On-site</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeCommitment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Commitment</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select commitment" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="part_time">Part-time</SelectItem>
                          <SelectItem value="full_time">Full-time</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Equity Range (%)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="equityMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">Minimum</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="equityMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-muted-foreground">Maximum</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            max="100" 
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Details Toggle */}
          <Card>
            <CardHeader>
              <CardTitle 
                className="flex items-center justify-between cursor-pointer" 
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Additional Details (Optional)
                </div>
                {showAdvanced ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </CardTitle>
              <CardDescription>
                Add more context to attract the right candidates
              </CardDescription>
            </CardHeader>
            
            {showAdvanced && (
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell potential team members more about your startup, mission, and vision..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="problemSolving"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Problem You're Solving</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What problem does your startup address?"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="targetMarket"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Market</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Who are your ideal customers?"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="competitiveAdvantage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Competitive Advantage</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What makes you different from competitors?"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="traction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Traction</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Users, revenue, partnerships, etc."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="fundingStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bootstrapped">Bootstrapped</SelectItem>
                            <SelectItem value="pre_seed">Pre-seed</SelectItem>
                            <SelectItem value="seed">Seed</SelectItem>
                            <SelectItem value="series_a">Series A</SelectItem>
                            <SelectItem value="series_b">Series B</SelectItem>
                            <SelectItem value="later">Later Stage</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fundingAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Amount ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g., 100000"
                            {...field} 
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="teamSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Team Size</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1"
                            placeholder="e.g., 3"
                            {...field} 
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Links</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://yourcompany.com"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://linkedin.com/company/..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://twitter.com/..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="github"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://github.com/..."
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigateTo('/dashboard', { message: 'Returning to dashboard...' })}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Listing...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-4 w-4" />
                  List Your Startup
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}