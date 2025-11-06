"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Target } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import type { UseFormReturn } from 'react-hook-form';
import type { ListingFormValues } from './page.types';

interface AdvancedDetailsCardProps {
  form: UseFormReturn<ListingFormValues>;
  showAdvanced: boolean;
  setShowAdvanced: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
}

export function AdvancedDetailsCard({ form, showAdvanced, setShowAdvanced, isSubmitting }: AdvancedDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Additional Details (Optional)
          </div>
          {showAdvanced ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CardTitle>
        <CardDescription>Add more context to attract the right candidates</CardDescription>
      </CardHeader>
      {showAdvanced && (
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detailed Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell potential team members more about your startup, mission, and vision..."
                    className="min-h-[100px]"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="problemSolving"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>The Problem You're Solving</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the pain point or market gap your startup addresses"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetMarket"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Market</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Who are your primary customers or users?"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="competitiveAdvantage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competitive Advantage</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What makes your approach unique or defensible?"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="traction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Traction</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Early growth, users, revenue, waitlist size, etc."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="fundingStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding Status</FormLabel>
                  <FormControl>
                    <select
                      className="w-full rounded-md border bg-background p-2"
                      value={field.value || ''}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <option value="">Select status</option>
                      <option value="bootstrapped">Bootstrapped</option>
                      <option value="pre_seed">Pre-Seed</option>
                      <option value="seed">Seed</option>
                      <option value="series_a">Series A</option>
                      <option value="series_b">Series B</option>
                      <option value="later">Later stage</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fundingAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teamSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Size</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <FormLabel>Links</FormLabel>
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/company/..." {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter / X</FormLabel>
                  <FormControl>
                    <Input placeholder="https://x.com/..." {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/org/..." {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
