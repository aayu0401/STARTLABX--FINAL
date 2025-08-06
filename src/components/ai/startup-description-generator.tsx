"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateStartupDescription } from '@/ai/flows/startup-description-generator';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  startupName: z.string().min(2, { message: 'Startup name must be at least 2 characters.' }),
  startupIndustry: z.string().min(3, { message: 'Please enter an industry.' }),
  startupMission: z.string().min(20, { message: 'Mission statement should be at least 20 characters.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function StartupDescriptionGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startupName: '',
      startupIndustry: '',
      startupMission: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setDescription('');
    try {
      const result = await generateStartupDescription(values);
      if (result?.description) {
        setDescription(result.description);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to generate description",
          description: "Our AI couldn't generate a description. Please try refining your inputs.",
        });
      }
    } catch (error) {
      console.error('Error generating startup description:', error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate description. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="startupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Startup Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., InnovateAI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startupIndustry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SaaS, HealthTech, FinTech" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
           <FormField
              control={form.control}
              name="startupMission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Startup Mission</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., To revolutionize data analytics with AI-driven insights for enterprise customers."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Briefly describe your startup's core mission and value proposition.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Description
              </>
            )}
          </Button>
        </form>
      </Form>
      
      {description && (
        <div className="mt-8 pt-6 border-t">
            <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Generated Description</h3>
            <div className="prose prose-stone dark:prose-invert bg-secondary/50 rounded-md p-4">
                <p>{description}</p>
            </div>
        </div>
      )}
    </>
  );
}
