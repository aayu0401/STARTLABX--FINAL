import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, Users, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const ideas = [
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

export default function IncubatorPage() {
  return (
    <div className="space-y-8">
      <Card className="text-center p-8 bg-primary/5">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Lightbulb className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Have a new venture idea?</CardTitle>
          <CardDescription className="max-w-xl mx-auto mt-2">
            Propose your idea to the community, find co-founders, and build the next big thing together. From ideation to launch, all within EquityBuild.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg">Propose a New Venture</Button>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Community Ventures</h2>
        <Input placeholder="Search ideas..." className="max-w-sm" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {ideas.map((idea) => (
          <Card key={idea.title} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{idea.title}</CardTitle>
              <div className="flex items-center gap-2 pt-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={idea.avatar} alt={idea.proposer} data-ai-hint={idea.dataAiHint} />
                  <AvatarFallback>{idea.proposer.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">Proposed by {idea.proposer}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground mb-4">{idea.description}</p>
              <p className="font-semibold text-sm mb-2">Seeking:</p>
              <div className="flex flex-wrap gap-2">
                {idea.seeking.map(role => <Badge key={role} variant="secondary">{role}</Badge>)}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-5 w-5" />
                <span>{idea.team} team member{idea.team !== 1 && 's'}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discuss
                </Button>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Join Team
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
