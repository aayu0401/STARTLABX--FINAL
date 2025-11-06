"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Idea } from './types';
import { analyticsService } from '@/services/analytics';

export function IdeaCard({ idea }: { idea: Idea }) {
  const onDiscuss = async () => {
    try { await analyticsService.trackButtonClick('idea_discuss', 'incubator'); } catch {}
  };
  const onJoin = async () => {
    try { await analyticsService.trackButtonClick('idea_join_team', 'incubator'); } catch {}
  };

  return (
    <Card key={idea.title} className="flex flex-col hover:shadow-xl">
      <CardHeader>
        <CardTitle>{idea.title}</CardTitle>
        <div className="flex items-center gap-2 pt-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={idea.avatar} alt={idea.proposer} data-ai-hint={idea.dataAiHint} />
            <AvatarFallback>{idea.proposer.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">Proposed by {idea.proposer}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="mb-4">{idea.description}</CardDescription>
        <p className="font-semibold text-sm mb-2">Seeking:</p>
        <div className="flex flex-wrap gap-2">
          {idea.seeking.map(role => <Badge key={role} variant="secondary">{role}</Badge>)}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-5 w-5" />
          <span>{idea.team} team member{idea.team !== 1 && 's'}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onDiscuss}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Discuss
          </Button>
          <Button onClick={onJoin}>
            <Users className="h-4 w-4 mr-2" />
            Join Team
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
