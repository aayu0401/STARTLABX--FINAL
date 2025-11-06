"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const pipelineStages = [
  { name: 'Build', status: 'success' },
  { name: 'Test', status: 'success' },
  { name: 'Deploy to Staging', status: 'in-progress' },
  { name: 'Manual Approval', status: 'pending' },
  { name: 'Deploy to Production', status: 'pending' },
] as const;

type Stage = typeof pipelineStages[number];

export function DevOpsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><GitBranch /> CI/CD Pipeline</CardTitle>
        <CardDescription>Live status of your deployment pipeline.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-4 overflow-x-auto">
          {pipelineStages.map((stage, index) => (
            <React.Fragment key={stage.name}>
              <div className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  stage.status === 'success' ? 'bg-green-500 text-white' : 
                  stage.status === 'in-progress' ? 'bg-blue-500 text-white animate-pulse' : 
                  'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                <p className="text-sm font-medium">{stage.name}</p>
                <Badge
                  variant={stage.status === 'success' ? 'default' : stage.status === 'in-progress' ? 'secondary' : 'outline'}
                  className={stage.status === 'success' ? 'bg-green-500/20 text-green-700' : ''}
                >
                  {stage.status.charAt(0).toUpperCase() + stage.status.slice(1)}
                </Badge>
              </div>
              {index < pipelineStages.length - 1 && <Separator className="flex-1" />}
            </React.Fragment>
          ))}
        </div>
        <Separator className="my-6" />
        <div className="space-y-4">
          <h4 className="font-semibold">Recent Deployments</h4>
          <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
            <p className="font-mono text-sm">#a3f5d8e - feat: Add user profile page</p>
            <p className="text-sm text-muted-foreground">3 hours ago - <span className="text-green-600 font-semibold">Success</span></p>
          </div>
          <div className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
            <p className="font-mono text-sm">#c1b9e2f - fix: Resolve login issue</p>
            <p className="text-sm text-muted-foreground">1 day ago - <span className="text-green-600 font-semibold">Success</span></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
