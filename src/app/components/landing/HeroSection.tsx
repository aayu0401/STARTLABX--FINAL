"use client";
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  isAuthenticated: boolean;
  onDashboard: () => Promise<void> | void;
}

export function HeroSection({ isAuthenticated, onDashboard }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-transparent z-0"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-headline">
              Build Your Vision, <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Together.</span>
            </h1>
            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground">
              Our platform connects early-stage founders with top-tier professionals ready to work for equity. Find the perfect team to bring your idea to life without upfront funding.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {isAuthenticated ? (
                <Button size="lg" onClick={onDashboard}>Go to Dashboard</Button>
              ) : (
                <Button asChild size="lg">
                  <Link href="/signup">Get Started - It's Invite-Only</Link>
                </Button>
              )}
              <Button asChild size="lg" variant="outline">
                <Link href="#features">
                  Learn More <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <Image
              src="https://placehold.co/600x600.png"
              width={600}
              height={600}
              alt="Team collaborating on a project"
              className="rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-500 ease-in-out"
              data-ai-hint="startup collaboration"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
