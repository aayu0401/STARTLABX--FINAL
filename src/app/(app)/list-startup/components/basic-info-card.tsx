"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { industries } from './constants';
import { LocationAutocomplete } from '@/components/ui/location-autocomplete';
import type { UseFormReturn } from 'react-hook-form';
import type { ListingFormValues } from './page.types';

interface BasicInfoCardProps {
  form: UseFormReturn<ListingFormValues>;
  isSubmitting: boolean;
}

export function BasicInfoCard({ form, isSubmitting }: BasicInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Basic Information
        </CardTitle>
        <CardDescription>
          Tell us about your startup and what makes it unique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Acme Inc" {...field} disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <LocationAutocomplete
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="e.g., San Francisco, CA"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  Search for your city or click the location button to use your current location
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
            name="tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tagline *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Making AI accessible to every business"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  A brief, compelling description of what your startup does (10-100 characters)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <select className="w-full rounded-md border bg-background p-2">
                      <option value="">Select industry</option>
                      {industries.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </FormControl>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Stage *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                  <FormControl>
                    <select className="w-full rounded-md border bg-background p-2">
                      <option value="idea">Idea</option>
                      <option value="mvp">MVP</option>
                      <option value="early_revenue">Early Revenue</option>
                      <option value="growth">Growth</option>
                      <option value="scaling">Scaling</option>
                    </select>
                  </FormControl>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
