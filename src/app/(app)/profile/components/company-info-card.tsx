"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Building } from 'lucide-react';
import type { UserProfileData } from './types';

export function CompanyInfoCard({ userProfile }: { userProfile: UserProfileData }) {
  if (userProfile.accountType !== 'startup') return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Company Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userProfile.industry && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Industry</label>
            <p className="mt-1">{userProfile.industry}</p>
          </div>
        )}
        {userProfile.stage && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Stage</label>
            <p className="mt-1 capitalize">{userProfile.stage.replace('_', ' ')}</p>
          </div>
        )}
        {userProfile.fundingStatus && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Funding Status</label>
            <p className="mt-1 capitalize">{userProfile.fundingStatus.replace('_', ' ')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
