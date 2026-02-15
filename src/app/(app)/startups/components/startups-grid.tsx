'use client';
import React from 'react';
import { StartupCard } from './startup-card';
import type { Startup } from './types';
import { startupService } from '@/services/startup.service';

export function StartupsGrid() {
  const [startups, setStartups] = React.useState<Startup[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await startupService.getStartups();
        const mapped: Startup[] = response.data.startups.map((s: any) => ({
          id: s.id,
          name: s.name,
          logo: s.logo || 'https://placehold.co/64x64.png?text=Logo',
          mission: s.mission || s.description?.slice(0, 100) || 'Building the future.',
          tags: (s.tags && s.tags.length > 0) ? s.tags : [s.stage || 'Early Stage', s.industry || 'Tech'],
          hiring: 'Co-Founder & Engineers', // Default prompt
          description: s.description
        }));
        setStartups(mapped);
      } catch (error) {
        console.error('Failed to fetch startups', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {startups.map((startup) => (
        <StartupCard key={startup.id} startup={startup} />
      ))}
    </div>
  );
}
