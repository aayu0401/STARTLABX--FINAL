"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Rocket, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Textarea } from '../../../components/ui/textarea';
import { useNavigation } from '@/hooks/use-navigation';
import { authService } from '@/services/auth.service';
import { analyticsService } from '@/services/analytics.service';
import { storage } from '@/lib/storage';
import { DemoLoginButton } from './demo-login-button';

const formSchema = z
  .object({
    fullName: z.string().min(1, { message: 'Full name is required' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' }),
    accountType: z.enum(['startup', 'professional'], {
      required_error: 'Please select an account type.',
    }),
    inviteCode: z.string().optional(),
    // Professional fields
    title: z.string().optional(),
    skills: z.string().optional(),
    availability: z.enum(['freelance', 'equity', 'cofounder']).optional(),
    // Startup fields
    company: z.string().min(1, "Startup name is required").optional().or(z.literal('')),
    industry: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.accountType === 'professional') {
      if (!data.title || data.title.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['title'],
          message: 'Title is required and must be at least 3 characters.',
        });
      }
      if (!data.skills || data.skills.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['skills'],
          message: 'Please list at least one skill.',
        });
      }
      if (!data.availability) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['availability'],
          message: 'Please select your availability.',
        });
      }
    }
  });

type UserFormValue = z.infer<typeof formSchema>;

export function SignUpForm() {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const { navigateTo } = useNavigation();

  // Track form started when component mounts
  React.useEffect(() => {
    analyticsService.trackFormInteraction('signup_form', 'started');
  }, []);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      company: '',
      industry: '',
      title: '',
      skills: '',
      // inviteCode removed
    },
  });

  const accountType = form.watch('accountType');

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);

    // Track signup started
    await analyticsService.track('sign_up_started', {
      account_type: data.accountType
    });

    try {
      // Register user with backend
      const response = await authService.signup({
        email: data.email,
        password: data.password,
        name: data.fullName,
        accountType: data.accountType,
        // Pro fields
        title: data.title,
        skills: data.skills,
        availability: data.availability,
        // Startup fields
        companyName: data.company,
        industry: data.industry,
      });

      // Store tokens
      storage.set('access_token', response.data.token);
      if (response.data.refreshToken) {
        storage.set('refresh_token', response.data.refreshToken);
      }

      // Set user properties for analytics
      await analyticsService.setUser(response.data.user.id, {
        account_type: data.accountType,
        full_name: data.fullName,
        email: data.email,
      });

      // Track successful signup
      await analyticsService.trackSignUp(data.accountType, true);

      toast({
        title: 'Account Created!',
        description:
          'Welcome to EquityBuild! Redirecting you to your dashboard...',
      });

      setLoading(false);
      await navigateTo('/dashboard', {
        message: 'Setting up your dashboard...',
        trackEvent: 'signup_complete_navigation'
      });
    } catch (error: any) {
      console.error("Signup failed:", error);

      // Track failed signup
      await analyticsService.trackSignUp(data.accountType, false);
      await analyticsService.trackError('signup_error', error.message, 'signup_form');

      toast({
        variant: "destructive",
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="accountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I am a...</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="startup">Startup / Founder</SelectItem>
                    <SelectItem value="professional">
                      Professional / Talent
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          {accountType === 'startup' && (
            <div className='space-y-4 p-5 border border-purple-500/20 rounded-xl bg-purple-500/5 animate-in slide-in-from-top-2 duration-300'>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-purple-500/20 rounded-lg">
                  <Rocket className="w-4 h-4 text-purple-400" />
                </div>
                <h3 className="text-sm font-semibold text-purple-200">Startup Details</h3>
              </div>

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Startup Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Pied Piper" className="bg-background/50" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="saas">SaaS / B2B</SelectItem>
                        <SelectItem value="fintech">Fintech</SelectItem>
                        <SelectItem value="health">HealthTech</SelectItem>
                        <SelectItem value="consumer">Consumer App</SelectItem>
                        <SelectItem value="ai">Artificial Intelligence</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {accountType === 'professional' && (
            <div className='space-y-4 p-5 border border-blue-500/20 rounded-xl bg-blue-500/5 animate-in slide-in-from-top-2 duration-300'>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-blue-200">Professional Profile</h3>
              </div>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Frontend Developer" className="bg-background/50" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., React, TypeScript, Figma..." className="bg-background/50 min-h-[80px]" disabled={loading} {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Enter a comma-separated list of your top skills.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Availability</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="What are you looking for?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cofounder">Co-founder (Equity)</SelectItem>
                        <SelectItem value="equity">Early Employee (Equity)</SelectItem>
                        <SelectItem value="freelance">Freelance / Contract</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <Button
            disabled={loading || !accountType}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            type="submit"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <DemoLoginButton />
        </form>
      </Form>
    </>
  );
}
