'use client';

import { useRouter } from 'next/navigation';
import { useLoading } from '@/contexts/loading-context';
import { analyticsService } from '@/services/analytics.service';

export function useNavigation() {
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const navigateTo = async (path: string, options?: {
    message?: string;
    delay?: number;
    trackEvent?: string;
  }) => {
    try {
      // Show loading screen
      showLoading(options?.message || 'Loading...');

      // Track navigation if specified
      if (options?.trackEvent) {
        await analyticsService.track(options.trackEvent, {
          destination: path,
          source: 'navigation'
        });
      }

      // Add a small delay for smooth transition
      if (options?.delay) {
        await new Promise(resolve => setTimeout(resolve, options.delay));
      }

      // Navigate
      router.push(path);

      // Hide loading after a short delay to allow page to start rendering
      setTimeout(() => {
        hideLoading();
      }, 300);

    } catch (error) {
      console.error('Navigation error:', error);
      hideLoading();
    }
  };

  const replace = async (path: string, options?: {
    message?: string;
    delay?: number;
  }) => {
    try {
      showLoading(options?.message || 'Loading...');

      if (options?.delay) {
        await new Promise(resolve => setTimeout(resolve, options.delay));
      }

      router.replace(path);

      setTimeout(() => {
        hideLoading();
      }, 300);

    } catch (error) {
      console.error('Navigation error:', error);
      hideLoading();
    }
  };

  return {
    navigateTo,
    replace,
    router,
  };
}