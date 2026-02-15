"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suggestTalent } from '@/ai/flows/talent-suggestions';
import { analyticsService } from '@/services/analytics.service';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../components/ui/avatar';
import { Badge } from '../../../../components/ui/badge';

const formSchema = z.object({
  startupDescription: z.string().min(50, { message: 'Please provide a detailed description of at least 50 characters.' }),
  requiredSkills: z.string().min(3, { message: 'Please list at least one skill.' }),
  equityExpectations: z.enum(['low', 'medium', 'high'], { required_error: 'Please select an equity expectation.' }),
});

type FormValues = z.infer<typeof formSchema>;

type TalentSuggestion = {
  name: string;
  description: string;
};

export function TalentMatchForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  // Track form interaction
  useEffect(() => {
    analyticsService.trackFormInteraction('talent_match_form', 'started');
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startupDescription: '',
      requiredSkills: '',
      equityExpectations: undefined,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setSuggestions([]);

    // Track AI feature usage
    await analyticsService.track('ai_match_requested', {
      startup_description_length: values.startupDescription.length,
      skills_count: values.requiredSkills.split(',').length,
      equity_expectation: values.equityExpectations,
    });

    try {
      const result = await suggestTalent(values);
      if (result?.talentSuggestions) {
        setSuggestions(result.talentSuggestions);

        // Track successful AI match
        await analyticsService.track('ai_match_completed', {
          suggestions_count: result.talentSuggestions.length,
          success: true,
        });
      } else {
        await analyticsService.track('ai_match_completed', {
          suggestions_count: 0,
          success: false,
          reason: 'no_matches_found',
        });

        toast({
          variant: "destructive",
          title: "No suggestions found",
          description: "Our AI couldn't find any matches. Try refining your criteria.",
        });
      }
    } catch (error) {
      console.error('Error fetching talent suggestions:', error);

      await analyticsService.trackError('ai_suggestion_error', String(error), 'talent_match_form');

      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to fetch talent suggestions. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="startupDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Startup Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., We are building a decentralized platform for artists to tokenize their work..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe your startup, mission, and current stage. The more detail, the better the match.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="requiredSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Skills</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., React, Node.js, UI/UX Design, Growth Hacking" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a comma-separated list of skills.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="equityExpectations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equity Expectations</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select equity range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low (e.g., Advisor, Part-time)</SelectItem>
                      <SelectItem value="medium">Medium (e.g., Early Employee)</SelectItem>
                      <SelectItem value="high">High (e.g., Co-founder)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The level of equity you are offering.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Matching...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Find Talent
              </>
            )}
          </Button>
        </form>
      </Form>

      {suggestions.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold tracking-tight mb-6">Talent Suggestions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((suggestion, index) => {
              const [name, ...descriptionParts] = suggestion.split(':');
              const description = descriptionParts.join(':').trim();
              return (
                <Card key={index} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://placehold.co/100x100?text=${name.charAt(0)}`} data-ai-hint="person face" />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{name}</CardTitle>
                      <CardDescription>Potential Match</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <p className="text-muted-foreground">{description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">React</Badge>
                      <Badge variant="secondary">UX Design</Badge>
                      <Badge variant="secondary">Marketing</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
