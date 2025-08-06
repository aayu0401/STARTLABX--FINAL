import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const startups = [
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

export default function StartupsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Startup Showcase</h2>
          <p className="text-muted-foreground mt-1">Discover innovative startups looking for talent.</p>
        </div>
        <Button>List a Startup</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {startups.map((startup, index) => (
          <Card key={index} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex-row items-start gap-4">
              <Image src={startup.logo} alt={`${startup.name} logo`} width={64} height={64} className="rounded-lg border" data-ai-hint={startup.dataAiHint} />
              <div>
                <CardTitle>{startup.name}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {startup.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{startup.mission}</p>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2">
                <p className="text-sm font-medium">Seeking: <span className="text-muted-foreground">{startup.hiring}</span></p>
                <Button className="w-full">View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
