"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { analyticsService } from '@/services/analytics.service';

export function PitchHero() {
  const onProposeClick = async () => {
    try {
      await analyticsService.trackButtonClick('propose_new_venture', { context: 'incubator' });
    } catch {
      // no-op analytics
    }
  };

  return (
    <Card className="text-center p-8 bg-primary/5 hover:shadow-lg">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Lightbulb className="h-16 w-16 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">Have a new venture idea?</CardTitle>
        <CardDescription className="max-w-xl mx-auto mt-2">
          Propose your idea to the community, find co-founders, and build the next big thing together. From ideation to launch, all within StartLabX.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="lg" onClick={onProposeClick}>Propose a New Venture</Button>
      </CardContent>
    </Card>
  );
}
