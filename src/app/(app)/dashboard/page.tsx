"use client";

import React from 'react';
import {
  Activity,
  Briefcase,
  Lightbulb,
  Users,
  Wand2,
} from 'lucide-react';
import { analyticsService } from '@/services/analytics';

import { TalentMatchForm } from '@/components/ai/talent-match-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';

import Link from 'next/link';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
  },
};

const liveFeed = [
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

export default function DashboardPage() {
  // Track page view on component mount
  React.useEffect(() => {
    analyticsService.trackPageView('Dashboard');
  }, []);

  const handleCardClick = async (cardName: string) => {
    await analyticsService.trackButtonClick(`${cardName}_card`, 'dashboard');
  };

  const handleViewAllActivity = async () => {
    await analyticsService.trackButtonClick('view_all_activity', 'dashboard');
  };


  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      <div className="w-full max-w-full">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Welcome back! Here's a snapshot of your startup ecosystem.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card 
          className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-200 dark:border-amber-800 hover:shadow-lg transition-shadow duration-300 cursor-pointer" 
          onClick={() => handleCardClick('community_ventures')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 min-w-0 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-amber-900 dark:text-amber-100 truncate">
              Community Ventures
            </CardTitle>
            <div className="p-1 sm:p-1.5 bg-amber-100 dark:bg-amber-900/50 rounded-md shrink-0 ml-1 sm:ml-2">
              <Lightbulb className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-amber-900 dark:text-amber-100">12</div>
            <p className="text-xs text-amber-700/70 dark:text-amber-300/70">
              +2 new ideas this month
            </p>
          </CardContent>
        </Card>
        <Card 
          className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow duration-300 cursor-pointer" 
          onClick={() => handleCardClick('active_professionals')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 min-w-0 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-100 truncate">
              Active Professionals
            </CardTitle>
            <div className="p-1 sm:p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-md shrink-0 ml-1 sm:ml-2">
              <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">+75</div>
            <p className="text-xs text-blue-700/70 dark:text-blue-300/70">
              +18% from last month
            </p>
          </CardContent>
        </Card>
        <Card 
          className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-shadow duration-300 cursor-pointer" 
          onClick={() => handleCardClick('projects_in_progress')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 min-w-0 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-emerald-900 dark:text-emerald-100 truncate">
              Projects In-Progress
            </CardTitle>
            <div className="p-1 sm:p-1.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-md shrink-0 ml-1 sm:ml-2">
              <Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-emerald-900 dark:text-emerald-100">+8</div>
            <p className="text-xs text-emerald-700/70 dark:text-emerald-300/70">+5 since last week</p>
          </CardContent>
        </Card>
        <Card 
          className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow duration-300 cursor-pointer" 
          onClick={() => handleCardClick('ai_matches')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 min-w-0 p-3 sm:p-4">
            <CardTitle className="text-xs sm:text-sm font-medium text-purple-900 dark:text-purple-100 truncate">
              AI Matches Found
            </CardTitle>
            <div className="p-1 sm:p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded-md shrink-0 ml-1 sm:ml-2">
              <Wand2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 p-3 sm:p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-purple-900 dark:text-purple-100">32</div>
            <p className="text-xs text-purple-700/70 dark:text-purple-300/70">
              +12 this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-7">
        <Card className="xl:col-span-4 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[250px] w-full min-w-0">
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                 <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="xl:col-span-3 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity /> Live Feed
            </CardTitle>
            <CardDescription>
              Recent activity from across the platform.
            </CardDescription>
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
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleViewAllActivity}
              >
                View All Activity
              </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>AI-Powered Talent Matching</CardTitle>
          <CardDescription>
            Describe your startup and needs, and let our AI suggest the perfect
            talent for your team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TalentMatchForm />
        </CardContent>
      </Card>
    </div>
  );
}
