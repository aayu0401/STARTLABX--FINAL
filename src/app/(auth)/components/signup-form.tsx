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
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Textarea } from '../../../components/ui/textarea';
import { useNavigation } from '@/hooks/use-navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createLegacyUserProfile } from '@/services/firestore';
import { analyticsService } from '@/services/analytics';

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
  })
  .superRefine((data, ctx) => {
    if (data.accountType === 'professional') {
      if (!data.inviteCode || data.inviteCode.length < 6) {
         ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['inviteCode'],
          message: 'A valid invite code is required for professionals.',
        });
      }
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
      inviteCode: '',
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
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // Set user properties for analytics
      await analyticsService.setUser(user.uid, {
        account_type: data.accountType,
        full_name: data.fullName,
        email: data.email,
      });

      // 2. Create user profile in Firestore
      await createLegacyUserProfile({
        uid: user.uid,
        email: data.email,
        fullName: data.fullName,
        accountType: data.accountType,
        title: data.title,
        skills: data.skills,
        availability: data.availability,
      });

      // Track successful signup
      await analyticsService.trackSignUp(data.accountType, true);

      toast({
        title: 'Account Created!',
        description:
          'Welcome to StartLabX! Redirecting you to your dashboard...',
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
          
          {accountType === 'professional' && (
            <div className='space-y-4 p-4 border rounded-lg bg-secondary/50'>
               <h3 className="text-sm font-medium text-muted-foreground">Professional Profile</h3>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Title</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Senior Frontend Developer" disabled={loading} {...field} />
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
                        <Textarea placeholder="e.g., React, TypeScript, Figma..." disabled={loading} {...field} />
                        </FormControl>
                         <FormDescription>
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
                          <SelectTrigger>
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
                 <FormField
                  control={form.control}
                  name="inviteCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invite Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your invite code"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Professional accounts require an invite code.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          )}
          
          {accountType === 'startup' && (
            <FormField
            control={form.control}
            name="inviteCode"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input {...field} value="startup-no-code-needed"/>
                </FormControl>
              </FormItem>
            )}
          />
          )}

          <Button 
            disabled={loading || !accountType} 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
            type="submit"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {accountType === 'professional' ? 'Request Access' : 'Sign Up'}
          </Button>
        </form>
      </Form>
      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign In
        </Link>
      </p>
    </>
  );
}
