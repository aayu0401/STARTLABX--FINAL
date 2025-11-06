"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { UseFormReturn } from 'react-hook-form';
import type { ListingFormValues } from './page.types';

interface WorkPreferencesCardProps {
  form: UseFormReturn<ListingFormValues>;
  isSubmitting: boolean;
}

export function WorkPreferencesCard({ form, isSubmitting }: WorkPreferencesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Work Preferences
        </CardTitle>
        <CardDescription>
          Define the working arrangement and equity range
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="workArrangement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Arrangement</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <select className="w-full rounded-md border bg-background p-2">
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onsite">On-site</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </FormControl>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="timeCommitment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Commitment</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <select className="w-full rounded-md border bg-background p-2">
                      <option value="part_time">Part-time</option>
                      <option value="full_time">Full-time</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </FormControl>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Equity Range (%)</Label>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="equityMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} max={100} step={1} {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equityMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} max={100} step={1} {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
