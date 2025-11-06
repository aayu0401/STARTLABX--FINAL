"use client";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import React from 'react';

export function KanbanColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex-1 min-w-[280px] sm:min-w-[300px] bg-secondary/50 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
        {title}
        <Button variant="ghost" size="icon" className="rounded-full">
          <PlusCircle className="h-5 w-5 text-muted-foreground" />
        </Button>
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
