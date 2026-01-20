'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Rocket, Users, TrendingUp, ArrowRight, CheckCircle, Star, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Validation',
      description: 'Validate your startup idea with AI in seconds',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Rocket,
      title: 'Instant MVP Planning',
      description: 'Generate detailed MVP roadmaps automatically',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Find Resources Fast',
      description: 'Hire talent on hourly, equity, or salary basis',
      color: 'from-pink-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'AI Contract Generation',
      description: 'Create legal contracts with AI assistance',
      color: 'from-red-500 to-orange-500'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-6 pt-20 pb-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <Badge variant="glass" className="mb-6 text-sm px-4 py-2 animate-fade-in">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Startup Platform
            </Badge>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-in-up">
              <span className="text-gradient-primary">Build Your Startup</span>
              <br />
              <span className="text-gray-900 dark:text-white">From Idea to MVP</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              Validate ideas, generate pitch decks, plan MVPs, and hire resources—all powered by AI
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/auth/signup">
                <Button size="lg" className="gradient-primary text-lg px-8 py-6 hover-lift">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/ai-builder">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 hover-lift">
                  Try AI Builder
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>1,000+ Startups</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>5,000+ Professionals</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Showcase */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Launch</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Powerful tools to turn your idea into reality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`p-6 hover-lift cursor-pointer transition-all ${activeFeature === index ? 'ring-2 ring-primary scale-105' : ''
                }`}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Launch your startup in 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Validate Your Idea', desc: 'AI analyzes market potential and competition' },
              { step: 2, title: 'Build Your Pitch', desc: 'Generate professional pitch deck automatically' },
              { step: 3, title: 'Plan Your MVP', desc: 'Get detailed roadmap with features and timeline' },
              { step: 4, title: 'Hire Your Team', desc: 'Find resources on equity, hourly, or salary basis' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '10K+', label: 'Ideas Validated' },
            { value: '5K+', label: 'Pitch Decks Created' },
            { value: '3K+', label: 'MVPs Planned' },
            { value: '15K+', label: 'Contracts Generated' }
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-4xl md:text-5xl font-bold text-gradient-primary mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-accent py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Build Your Startup?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of founders using AI to launch faster
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6">
              Start Building Now
              <Rocket className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">STARTLABX</h3>
              <p className="text-gray-400">
                AI-powered platform for startup success
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/ai-builder">AI Builder</Link></li>
                <li><Link href="/ai-copilot">AI Copilot</Link></li>
                <li><Link href="/marketplace">Marketplace</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/security">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 STARTLABX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
