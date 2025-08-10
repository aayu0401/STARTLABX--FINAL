import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, Users, Handshake, LayoutDashboard, BrainCircuit, Bot } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Rocket className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold font-headline">StartLabX</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="text-center py-20 sm:py-28 lg:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-headline">
              Build Your Vision, <span className="text-primary">Together</span>.
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              Our platform connects early-stage founders with top-tier professionals ready to work for equity. Find the perfect team to bring your idea to life without upfront funding.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/signup">Get Started - It's Invite-Only</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold font-headline">A Founder-Focused Ecosystem</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Everything you need to build, manage, and grow your equity-based team.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureCards.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-xl">
                  <CardHeader className="items-center">
                    {feature.icon}
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
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

      <footer className="bg-secondary py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} StartLabX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
