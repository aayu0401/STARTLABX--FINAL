'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-screen';
import { ProfileHeader } from './components/profile-header';
import { MainProfileCard } from './components/main-profile-card';
import { SkillsCard } from './components/skills-card';
import { CompanyInfoCard } from './components/company-info-card';
import { ProfessionalInfoCard } from './components/professional-info-card';
import { LinksCard } from './components/links-card';
import { AccountInfoCard } from './components/account-info-card';

export default function ProfilePage() {
  const { user, userProfile, loading } = useAuth();

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
            <p className="text-muted-foreground">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground mt-4">Loading your profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isStartup = userProfile.accountType === 'startup';
  const isProfessional = userProfile.accountType === 'professional';

  return (
    <div className="space-y-6">
      <ProfileHeader />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <MainProfileCard userProfile={userProfile} />
          {isProfessional && <SkillsCard userProfile={userProfile} />}
          {isStartup && <CompanyInfoCard userProfile={userProfile} />}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {isProfessional && <ProfessionalInfoCard userProfile={userProfile} />}
          <LinksCard userProfile={userProfile} />
          <AccountInfoCard userProfile={userProfile} />
        </div>
      </div>
    </div>
  );
}