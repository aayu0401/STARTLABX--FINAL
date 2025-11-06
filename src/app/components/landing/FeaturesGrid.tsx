"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { featureCards } from './constants';

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 sm:py-24 bg-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-headline">A Founder-Focused Ecosystem</h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Everything you need to build, manage, and grow your equity-based team.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCards.map((feature, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-card/80 backdrop-blur-sm border-primary/10"
            >
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">{feature.icon}</div>
                <CardTitle className="font-headline">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
