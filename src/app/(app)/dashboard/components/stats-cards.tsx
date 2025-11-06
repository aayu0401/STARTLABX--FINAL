"use client";
import React from 'react';
import { Briefcase, Lightbulb, Users, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { analyticsService } from '@/services/analytics';

function StatCard({
  title,
  value,
  subtitle,
  icon,
  className,
  onClick,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  className: string;
  onClick?: () => void | Promise<void>;
}) {
  return (
    <Card
      className={`relative overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 min-w-0 p-3 sm:p-4">
        <CardTitle className="text-xs sm:text-sm font-medium truncate">
          {title}
        </CardTitle>
        <div className="p-1 sm:p-1.5 rounded-md shrink-0 ml-1 sm:ml-2">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="relative z-10 p-3 sm:p-4 pt-0">
        <div className="text-xl sm:text-2xl font-bold">{value}</div>
        <p className="text-xs opacity-70">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const handleCardClick = async (cardName: string) => {
    await analyticsService.trackButtonClick(`${cardName}_card`, 'dashboard');
  };

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Community Ventures"
        value={12}
        subtitle={'+2 new ideas this month'}
        icon={<Lightbulb className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-600 dark:text-amber-400" />}
        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-200 dark:border-amber-800"
        onClick={() => handleCardClick('community_ventures')}
      />

      <StatCard
        title="Active Professionals"
        value={'+75'}
        subtitle={'+18% from last month'}
        icon={<Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 dark:text-blue-400" />}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800"
        onClick={() => handleCardClick('active_professionals')}
      />

      <StatCard
        title="Projects In-Progress"
        value={'+8'}
        subtitle={'+5 since last week'}
        icon={<Briefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600 dark:text-emerald-400" />}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-emerald-200 dark:border-emerald-800"
        onClick={() => handleCardClick('projects_in_progress')}
      />

      <StatCard
        title="AI Matches Found"
        value={32}
        subtitle={'+12 this month'}
        icon={<Wand2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple-600 dark:text-purple-400" />}
        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200 dark:border-purple-800"
        onClick={() => handleCardClick('ai_matches')}
      />
    </div>
  );
}
