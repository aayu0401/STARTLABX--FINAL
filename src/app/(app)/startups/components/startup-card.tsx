"use client";
import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Startup } from './types';

export function StartupCard({ startup }: { startup: Startup }) {
  return (
    <Card className="flex flex-col hover:shadow-xl">
      <CardHeader className="flex-row items-start gap-4">
        <Image src={startup.logo} alt={`${startup.name} logo`} width={64} height={64} className="rounded-lg border" data-ai-hint={startup.dataAiHint} />
        <div>
          <CardTitle>{startup.name}</CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            {startup.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{startup.mission}</CardDescription>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        <p className="text-sm font-medium">
          Seeking: <span className="text-muted-foreground">{startup.hiring}</span>
        </p>
        <Button className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );
}
