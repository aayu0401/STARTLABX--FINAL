"use client";
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import type { UseFormReturn } from 'react-hook-form';
import type { ListingFormValues } from './page.types';
import { roleOptions } from './constants';

interface LookingForCardProps {
  form: UseFormReturn<ListingFormValues>;
  onRoleToggle: (roleValue: string, checked: boolean) => void;
}

export function LookingForCard({ form, onRoleToggle }: LookingForCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          What You're Looking For
        </CardTitle>
        <CardDescription>
          Select all the roles you're looking to fill
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="lookingFor"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {roleOptions.map((role) => (
                  <FormField
                    key={role.value}
                    control={form.control}
                    name="lookingFor"
                    render={({ field }) => {
                      const checked = field.value?.includes(role.value);
                      return (
                        <FormItem key={role.value} className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(val) => onRoleToggle(role.value, Boolean(val))}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{role.label}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
