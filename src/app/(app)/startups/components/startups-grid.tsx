"use client";
import React from 'react';
import { StartupCard } from './startup-card';
import type { Startup } from './types';

const startups: Startup[] = [
  {
    name: 'InnovateAI',
    logo: 'https://placehold.co/100x100.png',
    dataAiHint: 'abstract logo',
    mission: 'Revolutionizing data analytics with AI-driven insights for enterprise customers.',
    tags: ['AI', 'SaaS', 'B2B'],
    hiring: 'Lead Developer, UX Designer',
  },
  {
    name: 'GreenThumb',
    logo: 'https://placehold.co/100x100.png',
    dataAiHint: 'leaf logo',
    mission: 'A mobile app connecting urban gardeners with local resources and communities.',
    tags: ['Mobile App', 'Sustainability', 'Community'],
    hiring: 'React Native Dev, Growth Hacker',
  },
  {
    name: 'FinFlow',
    logo: 'https://placehold.co/100x100.png',
    dataAiHint: 'finance logo',
    mission: 'Personal finance management for the gig economy workforce, simplifying taxes and savings.',
    tags: ['FinTech', 'Gig Economy', 'B2C'],
    hiring: 'Full-Stack Engineer',
  },
  {
    name: 'ConnectSphere',
    logo: 'https://placehold.co/100x100.png',
    dataAiHint: 'network logo',
    mission: 'A decentralized social network that gives users control over their data and content.',
    tags: ['Web3', 'Social Media', 'Decentralization'],
    hiring: 'Solidity Dev, Community Manager',
  },
  {
    name: 'HealthTrack',
    logo: 'https://placehold.co/100x100.png',
    dataAiHint: 'health logo',
    mission: 'Wearable tech that provides real-time health monitoring and predictive alerts.',
    tags: ['HealthTech', 'Hardware', 'IoT'],
    hiring: 'Firmware Engineer, Data Scientist',
  },
  {
    name: 'EduVerse',
    logo: 'https://placehold.co/100x100.png',
    dataAiHint: 'education logo',
    mission: 'An immersive VR platform for collaborative learning and virtual classrooms.',
    tags: ['EdTech', 'VR', 'Metaverse'],
    hiring: 'Unity Developer, 3D Artist',
  },
];

export function StartupsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {startups.map((startup) => (
        <StartupCard key={startup.name} startup={startup} />
      ))}
    </div>
  );
}
