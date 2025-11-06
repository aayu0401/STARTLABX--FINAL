"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { UserProfileData } from './types';

export function ProfessionalInfoCard({ userProfile }: { userProfile: UserProfileData }) {
  if (userProfile.accountType !== 'professional') return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Professional Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userProfile.availability && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Availability</label>
            <p className="mt-1 capitalize">{userProfile.availability}</p>
          </div>
        )}
        {userProfile.experience && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Experience Level</label>
            <p className="mt-1 capitalize">{userProfile.experience}</p>
          </div>
        )}
        {typeof userProfile.preferredEquity === 'number' && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Preferred Equity</label>
            <p className="mt-1">{userProfile.preferredEquity}%</p>
          </div>
        )}
        {typeof userProfile.hourlyRate === 'number' && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Hourly Rate</label>
            <p className="mt-1">${userProfile.hourlyRate}/hour</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
