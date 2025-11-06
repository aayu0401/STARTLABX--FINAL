"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Talent } from './types';

export function TalentCard({ talent }: { talent: Talent }) {
  return (
    <Card className="flex flex-col hover:shadow-xl group">
      <CardHeader className="text-center items-center">
        <Avatar className="w-24 h-24 mb-4 border-4 border-primary/20 group-hover:border-primary/40 transition-colors">
          <AvatarImage src={talent.avatar} alt={talent.name} data-ai-hint={talent.dataAiHint} />
          <AvatarFallback>{talent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <CardTitle>{talent.name}</CardTitle>
        <CardDescription>{talent.title}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-center mb-4">
          <Badge variant="outline">{talent.availability}</Badge>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {talent.skills.map((skill) => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Profile</Button>
      </CardFooter>
    </Card>
  );
}
