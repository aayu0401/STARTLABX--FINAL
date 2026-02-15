"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Talent } from './types';
import { MessageSquare } from 'lucide-react';

export function TalentCard({ talent }: { talent: Talent }) {
  return (
    <Card className="card-premium flex flex-col group relative overflow-hidden h-full">
      <div className="absolute top-0 right-0 p-3">
        <Badge variant="outline" className="bg-background/50 backdrop-blur-sm border-primary/20 text-[10px] font-black uppercase tracking-widest animate-pulse-subtle">
          {talent.availability || 'Available'}
        </Badge>
      </div>
      <CardHeader className="text-center items-center pb-2">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Avatar className="w-24 h-24 mb-4 border-4 border-white/10 dark:border-gray-800/50 shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-110">
            <AvatarImage src={talent.avatar} alt={talent.name} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold">
              {talent.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{talent.name}</CardTitle>
        <CardDescription className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/70">{talent.title}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-4">
        <div className="flex flex-wrap justify-center gap-2">
          {talent.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="glass" className="text-[10px] font-bold py-0.5 border-primary/10 hover:border-primary/30 transition-colors">
              {skill}
            </Badge>
          ))}
          {talent.skills.length > 4 && (
            <Badge variant="secondary" className="text-[10px] font-bold">+{talent.skills.length - 4}</Badge>
          )}
        </div>
        <p className="mt-4 text-xs text-center text-muted-foreground line-clamp-2 leading-relaxed italic">
          "{talent.bio || 'No bio available'}"
        </p>
      </CardContent>
      <CardFooter className="pt-2 gap-2">
        <Button className="flex-1 btn-premium py-6 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-primary/20">
          Analyze Profile
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-[52px] w-[52px] rounded-xl border-primary/20 hover:bg-primary/10 hover:border-primary/50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = `/messages?startWith=${talent.id}`;
          }}
        >
          <MessageSquare className="h-5 w-5 text-primary" />
        </Button>
      </CardFooter>
    </Card>
  );
}
