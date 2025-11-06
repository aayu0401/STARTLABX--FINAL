"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Rocket } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export function FormActions({ isSubmitting, onCancel }: FormActionsProps) {
  return (
    <div className="flex gap-4 justify-end">
      <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Listing...
          </>
        ) : (
          <>
            <Rocket className="mr-2 h-4 w-4" />
            List Your Startup
          </>
        )}
      </Button>
    </div>
  );
}
