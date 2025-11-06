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
    <Card>
      <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or skill..."
              className="pl-10"
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
        </div>
        <Select onValueChange={(v) => onRoleChange?.(v)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="designer">Designer</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="data-scientist">Data Scientist</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => onEquityChange?.(v)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Equity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
