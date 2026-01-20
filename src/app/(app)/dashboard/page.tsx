'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles, TrendingUp, Users, FileText, Clock, Target,
  Zap, Crown, ArrowRight, Plus, Bell, MessageSquare
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useSubscription } from '@/components/subscription/feature-gate';

export default function DashboardPage() {
  const { subscription, isPremium } = useSubscription();
  const [stats, setStats] = useState({
    aiCreditsUsed: 12,
    aiCreditsLimit: 50,
    pitchDecks: 2,
    mvpPlans: 1,
    contracts: 3,
    teamMembers: 2,
    connections: 145
  });

  const quickActions = [
    { icon: Sparkles, label: 'Validate Idea', href: '/ai-builder?tab=validate', color: 'from-blue-500 to-purple-500' },
    { icon: FileText, label: 'Create Pitch', href: '/ai-builder?tab=pitch', color: 'from-purple-500 to-pink-500' },
    { icon: Target, label: 'Plan MVP', href: '/ai-builder?tab=mvp', color: 'from-pink-500 to-red-500' },
    { icon: Users, label: 'Find Talent', href: '/ai-builder?tab=hire', color: 'from-red-500 to-orange-500' }
  ];

  const recentActivity = [
    { type: 'pitch', title: 'Pitch deck "TechStartup 2024" created', time: '2 hours ago', icon: FileText },
    { type: 'hire', title: 'New proposal from John Doe', time: '5 hours ago', icon: Users },
    { type: 'ai', title: 'Idea validation completed', time: '1 day ago', icon: Sparkles },
    { type: 'contract', title: 'NDA signed with Sarah', time: '2 days ago', icon: FileText }
  ];

  const upcomingTasks = [
    { title: 'Review hiring proposals', priority: 'high', dueDate: 'Today' },
    { title: 'Complete MVP feature list', priority: 'medium', dueDate: 'Tomorrow' },
    { title: 'Schedule investor meeting', priority: 'high', dueDate: 'This week' }
  ];

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your startup today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 hover-lift">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">AI Credits</span>
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div className="text-2xl font-bold mb-1">
            {stats.aiCreditsUsed}/{stats.aiCreditsLimit}
          </div>
          <Progress value={(stats.aiCreditsUsed / stats.aiCreditsLimit) * 100} className="h-2" />
        </Card>

        <Card className="p-4 hover-lift">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pitch Decks</span>
            <FileText className="w-5 h-5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold">{stats.pitchDecks}</div>
          <p className="text-xs text-gray-500">Created this month</p>
        </Card>

        <Card className="p-4 hover-lift">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">MVP Plans</span>
            <Target className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-2xl font-bold">{stats.mvpPlans}</div>
          <p className="text-xs text-gray-500">In progress</p>
        </Card>

        <Card className="p-4 hover-lift">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Connections</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold">{stats.connections}</div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +12 this week
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <button className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary transition-all group">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                </Link>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Link href="/activity">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Task
              </Button>
            </div>
            <div className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <input type="checkbox" className="rounded" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.dueDate}</p>
                  </div>
                  <Badge variant={task.priority === 'high' ? 'default' : 'glass'}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Subscription Status */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">
                {subscription?.planId || 'Free'} Plan
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {isPremium()
                ? 'You have access to all premium features'
                : 'Upgrade to unlock unlimited features'}
            </p>
            <Link href={isPremium() ? '/subscription' : '/pricing'}>
              <Button variant="outline" className="w-full">
                {isPremium() ? 'Manage Plan' : 'Upgrade Now'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>

          {/* AI Suggestions */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">AI Suggestions</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium mb-1">Complete your pitch deck</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Add financial projections to strengthen your pitch
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm font-medium mb-1">Expand your network</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Connect with 5 professionals in your industry
                </p>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <Badge variant="default">3</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer">
                <p className="font-medium">New message from Sarah</p>
                <p className="text-xs text-gray-500">5 min ago</p>
              </div>
              <div className="text-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer">
                <p className="font-medium">Proposal accepted</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
              <div className="text-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer">
                <p className="font-medium">Contract ready to sign</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
            </div>
            <Link href="/notifications">
              <Button variant="ghost" size="sm" className="w-full mt-3">
                View All
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
