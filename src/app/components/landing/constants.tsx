import { Rocket, Users, Handshake, LayoutDashboard, BrainCircuit, Bot } from 'lucide-react';
import { FeatureCard } from './types';

export const featureCards: FeatureCard[] = [
  {
    icon: <Rocket className="h-8 w-8 text-primary" />,
    title: 'Startup Profiles',
    description: 'Showcase your mission, team, and equity opportunities to attract the right talent.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Talent Marketplace',
    description: 'A directory of vetted developers, designers, and experts looking for their next venture.',
  },
  {
    icon: <Handshake className="h-8 w-8 text-primary" />,
    title: 'Equity Partnerships',
    description: 'Utilize our tools to create transparent and fair equity agreements with your new team members.',
  },
  {
    icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
    title: 'Collaboration Dashboard',
    description: 'Manage tasks, deadlines, and communications seamlessly within the platform.',
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI Talent Match',
    description: 'Our AI matches your startup with professionals based on skills and equity expectations.',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: 'Incubator Module',
    description: 'A collaborative space where talent and founders can propose and form teams for new ventures.',
  },
];
