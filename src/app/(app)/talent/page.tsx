'use client';

import { useState, useEffect } from 'react';
import { TalentHeader } from './components/talent-header';
import { TalentFilters } from './components/talent-filters';
import { TalentGrid } from './components/talent-grid';
import { NeuroMatch } from './components/neuro-match';
import { talentService } from '@/services/talent.service';
import { BrainCircuit } from 'lucide-react';
import type { Talent } from './components/types';

export default function TalentPage() {
  const [data, setData] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'neuro'>('grid');

  useEffect(() => {
    const fetchTalent = async () => {
      try {
        const res = await talentService.getAll();
        // Map service user to UI talent if needed, roughly checking compatibility
        setData(res.data.professionals as unknown as Talent[]);
      } catch (err) {
        console.error('Failed to fetch talent', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTalent();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <TalentHeader />
        <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-lg border border-secondary">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('neuro')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'neuro' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <BrainCircuit className="h-4 w-4" /> Neuro-Match
          </button>
        </div>
      </div>

      {viewMode === 'grid' && <TalentFilters />}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl" />
          ))}
        </div>
      ) : (
        viewMode === 'grid' ? (
          <TalentGrid data={data} />
        ) : (
          <NeuroMatch data={data} />
        )
      )}
    </div>
  );
}
