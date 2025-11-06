"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Globe, Link as LinkIcon, Linkedin, Github } from 'lucide-react';
import type { UserProfileData } from './types';

export function LinksCard({ userProfile }: { userProfile: UserProfileData }) {
  const isStartup = userProfile.accountType === 'startup';
  const isProfessional = userProfile.accountType === 'professional';
  const hasLinks = Boolean(
    (isStartup && userProfile.website) ||
    (isProfessional && (userProfile.portfolio || userProfile.linkedin || userProfile.github))
  );
  if (!hasLinks) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isStartup && userProfile.website && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">Website</a>
          </div>
        )}
        {isProfessional && userProfile.portfolio && (
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <a href={userProfile.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">Portfolio</a>
          </div>
        )}
        {isProfessional && userProfile.linkedin && (
          <div className="flex items-center gap-2">
            <Linkedin className="h-4 w-4 text-muted-foreground" />
            <a href={userProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">LinkedIn</a>
          </div>
        )}
        {isProfessional && userProfile.github && (
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4 text-muted-foreground" />
            <a href={userProfile.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">GitHub</a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
