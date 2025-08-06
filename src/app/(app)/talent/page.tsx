import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

const talentPool = [
  {
    name: 'Alice Johnson',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman face',
    title: 'Senior Frontend Developer',
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Design Systems'],
    equity: 'Medium',
    availability: 'Freelance/Equity',
  },
  {
    name: 'Bob Williams',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man face',
    title: 'Product Designer (UI/UX)',
    skills: ['Figma', 'User Research', 'Prototyping', 'Wireframing', 'Mobile UI'],
    equity: 'Low-Medium',
    availability: 'Equity',
  },
  {
    name: 'Charlie Brown',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man face',
    title: 'Full-Stack Engineer',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
    equity: 'High',
    availability: 'Co-founder',
  },
  {
    name: 'Diana Miller',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman face',
    title: 'Growth Marketing Expert',
    skills: ['SEO', 'Content Marketing', 'PPC', 'Social Media', 'Analytics'],
    equity: 'Low',
    availability: 'Freelance',
  },
  {
    name: 'Ethan Davis',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'man face',
    title: 'Mobile Developer',
    skills: ['React Native', 'Swift', 'Kotlin', 'Firebase'],
    equity: 'Medium',
    availability: 'Freelance/Equity',
  },
  {
    name: 'Fiona Garcia',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'woman face',
    title: 'Data Scientist',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'SQL'],
    equity: 'Medium-High',
    availability: 'Equity',
  },
];

export default function TalentPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Talent Marketplace</h2>
        <p className="text-muted-foreground mt-1">Find vetted professionals ready to build with you.</p>
      </div>
      <Card>
        <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search by name or skill..." className="pl-10" />
          </div>
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="data-scientist">Data Scientist</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Equity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {talentPool.map((talent) => (
          <Card key={talent.name} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center items-center">
              <Avatar className="w-24 h-24 mb-4 border-4 border-primary/20">
                <AvatarImage src={talent.avatar} alt={talent.name} data-ai-hint={talent.dataAiHint} />
                <AvatarFallback>{talent.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle>{talent.name}</CardTitle>
              <CardDescription>{talent.title}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-center mb-4">
                <Badge variant="outline">{talent.availability}</Badge>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {talent.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">View Profile</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
