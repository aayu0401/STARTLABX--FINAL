"use client";
import React from 'react';
import { IdeaCard } from './idea-card';
import type { Idea } from './types';

const ideas: Idea[] = [
  {
    title: 'AI-Powered Personal Nutritionist',
    proposer: 'Sarah Lee',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman face',
    description: 'A mobile app that uses AI to create personalized meal plans based on user health data, dietary preferences, and local grocery availability.',
    seeking: ['React Native Dev', 'AI/ML Engineer', 'UI/UX Designer'],
    team: 3,
  },
  {
    title: 'Sustainable Fashion Marketplace',
    proposer: 'David Chen',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man face',
    description: 'An e-commerce platform dedicated to certified sustainable and ethical fashion brands, featuring a transparent supply chain tracker.',
    seeking: ['Full-Stack Dev', 'Marketing Lead', 'Supply Chain Expert'],
    team: 2,
  },
  {
    title: 'Gamified Language Learning for Kids',
    proposer: 'Maria Garcia',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman face',
    description: 'An interactive and story-driven game that makes learning a new language fun and effective for children aged 6-10.',
    seeking: ['Game Developer (Unity)', 'Illustrator', 'Pedagogy Expert'],
    team: 1,
  },
  {
    title: 'Decentralized Freelance Platform',
    proposer: 'Kevin O_Leary',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man face',
    description: 'A Web3 platform that connects freelancers and clients with lower fees, instant payouts, and reputation managed on-chain.',
    seeking: ['Solidity Dev', 'Frontend Dev (React)', 'Community Manager'],
    team: 4,
  },
];

export function IdeasGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {ideas.map(idea => (
        <IdeaCard key={idea.title} idea={idea} />
      ))}
    </div>
  );
}
