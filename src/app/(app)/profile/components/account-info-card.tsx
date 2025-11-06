"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, User } from 'lucide-react';
import type { UserProfileData } from './types';

export function AccountInfoCard({ userProfile }: { userProfile: UserProfileData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Account Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Joined</span>
          <span>{new Date(userProfile.createdAt || Date.now()).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Account Type</span>
          <span className="capitalize">{userProfile.accountType}</span>
        </div>
      </CardContent>
    </Card>
  );
}
