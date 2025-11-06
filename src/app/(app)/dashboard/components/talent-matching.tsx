"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TalentMatchForm } from '@/app/(app)/dashboard/components/talent-match-form';

export function TalentMatching() {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle>AI-Powered Talent Matching</CardTitle>
        <CardDescription>
          Describe your startup and needs, and let our AI suggest the perfect talent for your team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TalentMatchForm />
      </CardContent>
    </Card>
  );
}
