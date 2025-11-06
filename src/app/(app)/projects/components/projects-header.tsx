"use client";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function ProjectsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Project Dashboard</h2>
        <p className="text-muted-foreground mt-1">Organize tasks, track progress, and collaborate with your team.</p>
      </div>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        New Project
      </Button>
    </div>
  );
}
