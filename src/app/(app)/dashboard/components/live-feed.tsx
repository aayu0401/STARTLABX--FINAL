"use client";
import React from 'react';
import Link from 'next/link';
import { Activity } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { analyticsService } from '@/services/analytics';
import type { LiveFeedItem } from './types';

const liveFeed: LiveFeedItem[] = [
  {
    user: 'Sarah Lee',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman face',
    action: 'proposed a new venture:',
    subject: 'AI-Powered Personal Nutritionist',
    time: '5m ago',
  },
  {
    user: 'Alice Johnson',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman face',
    action: 'joined the talent pool as a',
    subject: 'Senior Frontend Developer',
    time: '30m ago',
  },
  {
    user: 'InnovateAI',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'abstract logo',
    action: 'is looking for a',
    subject: 'Lead Developer',
    time: '1h ago',
  },
  {
    user: 'Kevin O_Leary',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man face',
    action: 'started a discussion on',
    subject: 'Web3 Platform Security',
    time: '2h ago',
  },
];

export function LiveFeed() {
  const handleViewAllActivity = async () => {
    await analyticsService.trackButtonClick('view_all_activity', 'dashboard');
  };

  return (
    <Card className="xl:col-span-3 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity /> Live Feed
        </CardTitle>
        <CardDescription>Recent activity from across the platform.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {liveFeed.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <Avatar className="h-9 w-9 border-2 border-primary/20">
              <AvatarImage src={item.avatar} alt={item.user} data-ai-hint={item.dataAiHint} />
              <AvatarFallback>{item.user.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{item.user}</span>{' '}
                {item.action}{' '}
                <Link href="#" className="font-semibold text-primary hover:underline">
                  {item.subject}
                </Link>
              </p>
              <p className="text-xs text-muted-foreground/80 mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
        <Separator />
        <Button variant="outline" className="w-full" onClick={handleViewAllActivity}>
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
}
