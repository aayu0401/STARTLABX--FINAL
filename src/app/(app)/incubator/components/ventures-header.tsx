"use client";
import React from 'react';
import { Input } from '@/components/ui/input';

export function VenturesHeader() {
  const [query, setQuery] = React.useState('');

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold tracking-tight">Community Ventures</h2>
      <Input
        placeholder="Search ideas..."
        className="max-w-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
