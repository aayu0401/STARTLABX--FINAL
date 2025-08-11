"use client";

import {
  Activity,
  Briefcase,
  Lightbulb,
  Users,
  Wand2,
} from 'lucide-react';

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
import { TalentMatchForm } from '@/components/ai/talent-match-form';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's a snapshot of your startup ecosystem.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Community Ventures
            </CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 new ideas this month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Professionals
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+75</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Projects In-Progress
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+8</div>
            <p className="text-xs text-muted-foreground">+5 since last week</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              AI Matches Found
            </CardTitle>
            <Wand2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">
              +12 this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
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
        <Card className="lg:col-span-3 hover:shadow-lg">
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
              <Button variant="outline" className="w-full">View All Activity</Button>
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
