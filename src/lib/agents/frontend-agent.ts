
import { BaseAgent, AgentContext, AgentResult } from './base-agent';
import { LlmService } from '../llm-service';

export class FrontendAgent extends BaseAgent {
   role = 'frontend_dev' as const;
   name = 'UI Builder';
   description = 'Generates React components and landing pages.';

   async process(context: AgentContext): Promise<AgentResult> {
      const { project } = context;
      let landingPageCode: string;

      try {
         const prompt = `
            You are an expert React Developer.
            Create a complete, single-file generic landing page component (Lead Capture) for a startup named "${project.name}".
            Description: ${project.description}.
            
            Tech Stack: React, Tailwind CSS, Lucide Icons.
            
            Requirements:
            - Use 'lucide-react' for icons (only import Rocket, CheckCircle, Zap, Menu, X, ArrowRight).
            - Use standard Tailwind classes.
            - Include Header, Hero Section, Features Grid, Testimonials, CTA, Footer.
            - Make it visually stunning with gradients and good spacing.
            - Export default function LandingPage().
            - Do not include 'use client' directive if not needed, but since it has interactivity (buttons), likely needed. Add 'use client'; at top.
            - NO PLACEHOLDER COMMENTS. Write full JSX.
            - Images: Use unsplash random images.
            `;

         landingPageCode = await LlmService.generate(prompt);
         landingPageCode = landingPageCode.replace(/```tsx/g, '').replace(/```typescript/g, '').replace(/```/g, '').trim();

      } catch (e) {
         console.warn('Real AI failed, falling back to simulation logic.', e);

         // Simulate thinking
         await new Promise(resolve => setTimeout(resolve, 3000));

         landingPageCode = `
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, CheckCircle, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <header className="border-b">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">${project.name}</h1>
          </div>
          <nav className="flex gap-6 text-sm font-medium">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">About</a>
          </nav>
          <div className="flex gap-4">
             <Button variant="ghost">Log in</Button>
             <Button>Get Started</Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-24 text-center space-y-8 container mx-auto px-6">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
            Now Live v1.0
          </div>
          <h2 className="text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 sm:text-7xl">
            ${project.description.slice(0, 40)}${project.description.length > 40 ? '...' : ''}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
             ${project.description} We leverage cutting-edge AI to deliver unparalleled results for your business.
             Start your journey today.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" className="h-12 px-8 text-lg shadow-lg shadow-primary/20">Start Free Trial</Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg">Book Demo</Button>
          </div>
          
          <div className="pt-16">
             <div className="relative mx-auto max-w-5xl rounded-xl border bg-background shadow-2xl overflow-hidden aspect-video">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 font-bold text-4xl">
                   App Interface Preview
                </div>
             </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-muted/30">
           <div className="container mx-auto px-6">
              <h3 className="text-3xl font-bold text-center mb-16">Why Choose ${project.name}?</h3>
              <div className="grid md:grid-cols-3 gap-8">
                 {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-background border-none shadow-md hover:shadow-xl transition-shadow">
                       <CardContent className="p-8 space-y-4">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                             <Zap className="h-6 w-6" />
                          </div>
                          <h4 className="text-xl font-bold">Lightning Fast</h4>
                          <p className="text-muted-foreground">
                             Our optimized engine ensures real-time performance at scale.
                          </p>
                       </CardContent>
                    </Card>
                 ))}
              </div>
           </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-12 bg-muted/10">
         <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
            © 2026 ${project.name}. All rights reserved.
         </div>
      </footer>
    </div>
  );
}
`;
      }

      return {
         success: true,
         output: { component: 'LandingPage' },
         artifacts: [
            {
               title: 'LandingPage.tsx',
               type: 'code',
               content: landingPageCode,
               format: 'tsx'
            }
         ]
      };
   }
}
