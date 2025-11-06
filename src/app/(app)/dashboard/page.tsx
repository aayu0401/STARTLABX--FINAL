"use client";
import React from 'react';
import { analyticsService } from '@/services/analytics';
import { DashboardHeader } from './components/dashboard-header';
import { StatsCards } from './components/stats-cards';
import { PlatformGrowth } from './components/platform-growth';
import { LiveFeed } from './components/live-feed';
import { TalentMatching } from './components/talent-matching';

export default function DashboardPage() {
  React.useEffect(() => {
    analyticsService.trackPageView('Dashboard');
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      <DashboardHeader />
      <StatsCards />
      <div className="grid gap-6 xl:grid-cols-7">
        <PlatformGrowth />
        <LiveFeed />
      </div>
      <TalentMatching />
    </div>
  );
}
