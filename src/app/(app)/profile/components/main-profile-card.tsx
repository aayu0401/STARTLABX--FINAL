"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mail } from 'lucide-react';
import type { UserProfileData } from './types';

export function MainProfileCard({ userProfile }: { userProfile: UserProfileData }) {
  const isStartup = userProfile.accountType === 'startup';
  const isProfessional = userProfile.accountType === 'professional';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://placehold.co/200x200" alt={userProfile.fullName} />
            <AvatarFallback className="text-lg">
              {userProfile.fullName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{userProfile.fullName}</CardTitle>
              <Badge variant={isStartup ? 'default' : 'secondary'}>
                {isStartup ? 'Founder' : 'Professional'}
              </Badge>
            </div>
            {isProfessional && userProfile.title && (
              <p className="text-muted-foreground font-medium">{userProfile.title}</p>
            )}
            {isStartup && userProfile.companyName && (
              <p className="text-muted-foreground font-medium">{userProfile.companyName}</p>
            )}
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              {userProfile.email}
            </div>
          </div>
        </div>
      </CardHeader>

      {isStartup && userProfile.description && (
        <CardContent className="pt-0">
          <h3 className="font-semibold mb-2">About</h3>
          <p className="text-muted-foreground">{userProfile.description}</p>
        </CardContent>
      )}
    </Card>
  );
}
