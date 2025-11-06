"use client";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';
import type { UserProfileData } from './types';

export function SkillsCard({ userProfile }: { userProfile: UserProfileData }) {
  if (!userProfile.skills) return null;
  const skills = userProfile.skills.split(',').map(s => s.trim()).filter(Boolean);
  if (skills.length === 0) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Skills & Expertise
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <Badge key={i} variant="outline">{skill}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
