import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Users, Handshake, LayoutDashboard, BrainCircuit, Bot, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const featureCards = [
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

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2">
          <Rocket className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold font-headline">StartLabX</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-transparent z-0"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-headline">
                  Build Your Vision, <br />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Together.
                  </span>
                </h1>
                <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground">
                  Our platform connects early-stage founders with top-tier professionals ready to work for equity. Find the perfect team to bring your idea to life without upfront funding.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button asChild size="lg">
                    <Link href="/signup">Get Started - It's Invite-Only</Link>
                  </Button>
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
                <Card key={index} className="text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-card/80 backdrop-blur-sm border-primary/10">
                  <CardHeader className="items-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                      {feature.icon}
                    </div>
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
      </main>

      <footer className="bg-secondary/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} StartLabX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
