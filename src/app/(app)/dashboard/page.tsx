'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, Eye, Activity, Zap, TrendingUp, Calendar, Rocket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { dashboardService, type DashboardData } from '@/services/dashboard.service';
import { DashboardSkeleton } from '@/components/skeletons/dashboard-skeleton';
import { useQuery } from '@tanstack/react-query';
import { SystemActivity } from '@/components/dashboard/system-activity';
import { TractionScore } from '@/components/dashboard/traction-score';
import { FounderDnaCard } from '@/components/dashboard/founder-dna';
import { InvestorDealFlow } from '@/components/dashboard/investor-deal-flow';
import { ConsequenceWidget } from '@/components/dashboard/consequence-widget';
import { EquitySplitWidget } from '@/components/dashboard/equity-split-widget';
import { StartupGraphWidget } from '@/components/dashboard/startup-graph-widget';
import { BoardMeetingWidget } from '@/components/dashboard/board-meeting-widget';
import { ExitStrategyWidget } from '@/components/dashboard/exit-strategy-widget';
import { FounderRhythmWidget } from '@/components/dashboard/rhythm/founder-rhythm-widget';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await dashboardService.getDashboard();
      return response.data;
    }
  });

  if (isLoading) return <DashboardSkeleton />;
  if (!dashboardData) return (
    <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
      <h2 className="text-xl font-semibold mb-2">Failed to load dashboard</h2>
      <Button onClick={() => refetch()}>Retry</Button>
    </div>
  );

  const { stats, engagementData, topPosts } = dashboardData;
  const isFounder = userProfile?.accountType === 'startup';
  const roleTitle = isFounder ? 'Founder Dashboard' : 'Professional Dashboard';

  // Prepare chart data
  const chartData = engagementData.map(d => ({
    name: d.date,
    views: d.views,
    interactions: d.likes + d.comments + d.shares
  }));

  const statsConfig = [
    {
      title: isFounder ? 'Startup Views' : 'Profile Views',
      value: stats.totalViews.toLocaleString(),
      change: `+${stats.viewsChange}%`,
      icon: Eye,
      trend: stats.viewsChange >= 0 ? 'up' : 'down' as 'up' | 'down',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      title: isFounder ? 'Potential Investors' : 'Recruiter Views',
      value: stats.newFollowers.toLocaleString(),
      change: `+${stats.followersChange}%`,
      icon: Users,
      trend: stats.followersChange >= 0 ? 'up' : 'down' as 'up' | 'down',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      title: 'Engagement Rate',
      value: `${stats.engagementRate}%`,
      change: stats.engagementChange >= 0 ? `+${stats.engagementChange}%` : `${stats.engagementChange}%`,
      icon: Activity,
      trend: stats.engagementChange >= 0 ? 'up' : 'down' as 'up' | 'down',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10'
    },
    {
      title: 'Interactions',
      value: stats.totalInteractions.toLocaleString(),
      change: `+${stats.interactionsChange}%`,
      icon: TrendingUp,
      trend: stats.interactionsChange >= 0 ? 'up' : 'down' as 'up' | 'down',
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between animate-in fade-in slide-in-from-top duration-700">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black tracking-tighter text-gradient-primary">{roleTitle}</h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Protocol Active</span>
            </div>
          </div>
          <p className="text-muted-foreground mt-1 font-medium italic">Welcome back, {userProfile?.name?.split(' ')[0] || 'Commander'}. Initializing daily overview...</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex gap-2" onClick={() => refetch()}>
            <Calendar className="h-4 w-4" />
            Sync Now
          </Button>
          <Button variant="gradient" size="sm" className="gap-2" onClick={() => window.location.href = isFounder ? '/incubator' : '/profile'}>
            <Zap className="h-4 w-4" />
            {isFounder ? 'Launch New Project' : 'Update Portfolio'}
          </Button>
        </div>
      </div>

      {/* V3 ENGINE: Traction Score & Milestones */}
      {isFounder && dashboardData.traction && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-500">
          {/* Traction Score take 1/3 width */}
          <div className="col-span-1">
            <TractionScore metrics={dashboardData.traction} />
          </div>

          {/* Placeholder for Roadmap/Milestones (2/3 width) - coming next */}
          <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-card to-background border border-muted/40 rounded-xl p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Rocket className="h-4 w-4 text-purple-500" />
                Startup Roadmap
              </h3>
              <Button variant="ghost" size="sm" className="text-xs uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">View All</Button>
            </div>

            <div className="space-y-4">
              {dashboardData.milestones?.map((m, i) => (
                <div key={m.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 border border-transparent hover:border-primary/20 transition-colors">
                  <div className={cn("w-2 h-2 rounded-full", m.status === 'completed' ? 'bg-green-500' : m.status === 'in_progress' ? 'bg-yellow-500 animate-pulse' : 'bg-muted')} />
                  <div className="flex-1">
                    <h4 className={cn("text-sm font-semibold", m.status === 'completed' && 'line-through text-muted-foreground')}>{m.title}</h4>
                    {m.dueDate && <span className="text-[10px] text-muted-foreground font-mono">Due: {m.dueDate}</span>}
                  </div>
                  {m.status === 'pending' && <Button size="sm" variant="outline" className="h-7 text-xs">Start</Button>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* V5 INTEGRATION: Founder Operating Rhythm */}
      {isFounder && dashboardData.founderRhythm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom duration-700 delay-100 mb-6">
          <div className="col-span-1">
            <FounderRhythmWidget data={dashboardData.founderRhythm} />
          </div>
          <div className="col-span-1">
            {/* Motivational Quote / Focus Card */}
            <div className="h-full bg-gradient-to-br from-background to-muted/20 border-border/40 border rounded-lg flex flex-col items-center justify-center p-6 text-center">
              <blockquote className="italic text-lg text-muted-foreground font-light font-serif mb-4">
                "Amateurs sit and wait for inspiration, the rest of us just get up and go to work."
              </blockquote>
              <cite className="text-sm font-bold text-primary">— Stephen King</cite>
            </div>
          </div>
        </div>
      )}

      {/* V3 INTEGRATION: Founder OS Grid (4 Pillars) */}
      {isFounder && dashboardData.founderDNA && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom duration-700 delay-100 mb-6">
          <div className="col-span-1">
            <FounderDnaCard />
          </div>
          <div className="col-span-1">
            <ConsequenceWidget data={dashboardData} />
          </div>
          <div className="col-span-1">
            {dashboardData.equityMap && <EquitySplitWidget data={dashboardData.equityMap} />}
          </div>
          <div className="col-span-1">
            <StartupGraphWidget pivots={dashboardData.pivots} moat={dashboardData.moat} />
          </div>
        </div>
      )}

      {/* V3 INTEGRATION: Lifecycle Management */}
      {isFounder && dashboardData.boardMeetings && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom duration-700 delay-200 mb-6">
          <div className="col-span-1">
            <BoardMeetingWidget meetings={dashboardData.boardMeetings} />
          </div>
          <div className="col-span-1">
            <ExitStrategyWidget strategy={dashboardData.exitStrategy} />
          </div>
        </div>
      )}

      {/* V3 INTEGRATION: Investor / Talent View */}
      {
        !isFounder && dashboardData.investorDeals && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-500 mb-6">
            <div className="col-span-1 md:col-span-2">
              <InvestorDealFlow deals={dashboardData.investorDeals} />
            </div>
            <div className="col-span-1">
              {/* Placeholder for "My Portfolio" or "Upcoming Interviews" */}
              <Card className="h-full border-muted/40 p-6 flex flex-col justify-center items-center text-center bg-gradient-to-br from-background to-primary/5">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Portfolio Performance</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Your angel investments are up <strong>12.4%</strong> this quarter.
                  2 startups are raising follow-on rounds.
                </p>
                <Button variant="outline" className="w-full">View Portfolio</Button>
              </Card>
            </div>
          </div>
        )
      }

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsConfig.map((stat, i) => (
          <Card
            key={i}
            hover
            glass
            className="border-muted/40 animate-slide-up opacity-0 [animation-fill-mode:forwards]"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <div className={`flex items-center gap-1 mt-1 text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  <span>{stat.change}</span>
                  <span className="text-muted-foreground ml-1">vs last period</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-4 border-muted/40 shadow-sm">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Your content performance over the latest tracked period.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                <Area type="monotone" dataKey="interactions" stroke="#82ca9d" strokeWidth={2} fillOpacity={1} fill="url(#colorInteractions)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Feed / System Activity */}
        <div className="lg:col-span-3">
          <SystemActivity />
        </div>
      </div>

      {/* Quick Access / Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-500">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">AI Creator Studio</h4>
              <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80">Draft content with AI assistance.</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto">Open</Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-500">
              <Rocket className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">Find Co-Founders</h4>
              <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80">68 new matches this week.</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto">View</Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-amber-500/20 text-amber-500">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 dark:text-amber-100">Mentorships</h4>
              <p className="text-xs text-amber-700/80 dark:text-amber-300/80">Connect with industry leaders.</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto">Browse</Button>
          </CardContent>
        </Card>
      </div>
    </div >
  );
}
