import React from 'react';
import { Talent } from './types';
import { TalentCard } from './talent-card';

export function TalentGrid({ data }: { data: Talent[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.map((talent) => (
        <TalentCard key={talent.name} talent={talent} />
      ))}
    </div>
  );
}
