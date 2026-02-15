"use client";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import React from 'react';

interface TalentFiltersProps {
  onSearchChange?: (value: string) => void;
  onRoleChange?: (value: string) => void;
  onEquityChange?: (value: string) => void;
}

export function TalentFilters({ onSearchChange, onRoleChange, onEquityChange }: TalentFiltersProps) {
  return (
    <Card className="glass-card border-muted/30 shadow-sm hover-glow transition-all duration-500 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-transparent pointer-events-none" />
      <CardContent className="pt-6 pb-6 flex flex-col md:flex-row gap-4 relative z-10">
        <div className="relative flex-grow group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-all group-focus-within:text-primary" />
          <Input
            placeholder="Filter by keyword, skill or persona..."
            className="pl-10 bg-background/50 border-muted-foreground/20 focus:border-primary transition-all rounded-xl"
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
        <Select onValueChange={(v) => onRoleChange?.(v)}>
          <SelectTrigger className="w-full md:w-[200px] h-11 bg-background/50 border-muted-foreground/20 rounded-xl">
            <SelectValue placeholder="Work Persona" />
          </SelectTrigger>
          <SelectContent className="glass shadow-2xl border-muted-foreground/10 rounded-xl">
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="designer">Designer</SelectItem>
            <SelectItem value="product">Product Manager</SelectItem>
            <SelectItem value="growth">Growth Hacker</SelectItem>
            <SelectItem value="ai">AI Specialist</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => onEquityChange?.(v)}>
          <SelectTrigger className="w-full md:w-[150px] h-11 bg-background/50 border-muted-foreground/20 rounded-xl">
            <SelectValue placeholder="Equity Preference" />
          </SelectTrigger>
          <SelectContent className="glass shadow-2xl border-muted-foreground/10 rounded-xl">
            <SelectItem value="none">Fixed Only</SelectItem>
            <SelectItem value="low">Subtle (0.5 - 2%)</SelectItem>
            <SelectItem value="medium">Partner (2 - 5%)</SelectItem>
            <SelectItem value="high">Co-Founder (5%+)</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
