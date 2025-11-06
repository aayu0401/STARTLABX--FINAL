"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigation } from '@/hooks/use-navigation';

export function ShowcaseHeader() {
  const { navigateTo } = useNavigation();

  const handleListStartup = async () => {
    await navigateTo('/list-startup', {
      message: 'Loading startup form...',
      trackEvent: 'startups_page_list_startup_click',
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Startup Showcase</h2>
        <p className="text-muted-foreground mt-1">Discover innovative startups looking for talent.</p>
      </div>
      <Button
        onClick={handleListStartup}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shrink-0"
      >
        <Plus className="h-4 w-4 mr-2" />
        List Your Startup
      </Button>
    </div>
  );
}
