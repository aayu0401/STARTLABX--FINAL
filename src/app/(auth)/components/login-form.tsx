"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useNavigation } from '@/hooks/use-navigation';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { analyticsService } from '@/services/analytics';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' }),
});

type UserFormValue = z.infer<typeof formSchema>;

export function LoginForm() {
  const [loading, setLoading] = React.useState(false);
  const { navigateTo } = useNavigation();
  const { toast } = useToast();
  const BYPASS = process.env.NEXT_PUBLIC_AUTH_BYPASS === 'true';

  // Track form started when component mounts
  React.useEffect(() => {
    analyticsService.trackFormInteraction('login_form', 'started');
  }, []);

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    
    // Track login started
    await analyticsService.track('login_started');

    try {
      if (!BYPASS) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      }
      
      // Track successful login
      await analyticsService.trackLogin(true);

      toast({
        title: 'Login Successful',
        description: 'Welcome back! Redirecting you to your dashboard...',
      });

      setLoading(false);
      await navigateTo('/dashboard', { 
        message: 'Loading your dashboard...',
        trackEvent: 'login_complete_navigation'
      });
    } catch (error: any) {
      console.error("Login failed:", error);
      
      // Track failed login
      await analyticsService.trackLogin(false, error.message);

      toast({
        variant: "destructive",
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
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
                    placeholder="Enter your password..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            disabled={loading} 
            className="ml-auto w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
            type="submit"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </Form>
      <p className="px-8 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link
          href="/signup"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign Up
        </Link>
      </p>
    </>
  );
}
