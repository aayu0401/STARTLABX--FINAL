
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, Zap } from 'lucide-react';

interface PreviewProps {
    data: {
        name: string;
        description: string;
    }
}

export function LandingPagePreview({ data }: PreviewProps) {
    return (
        <div className="bg-background text-foreground flex flex-col h-full overflow-y-auto">
            {/* Navbar */}
            <header className="border-b shrink-0">
                <div className="container mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Rocket className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-bold">{data.name}</h1>
                    </div>
                    <nav className="hidden md:flex gap-6 text-sm font-medium">
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">About</a>
                    </nav>
                    <div className="flex gap-4">
                        <Button variant="ghost" size="sm">Log in</Button>
                        <Button size="sm">Get Started</Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1">
                <section className="py-12 md:py-24 text-center space-y-8 container mx-auto px-6">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary text-secondary-foreground">
                        Now Live v1.0
                    </div>
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                        {data.description.slice(0, 40)}{data.description.length > 40 ? '...' : ''}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {data.description} We leverage cutting-edge AI to deliver unparalleled results for your business.
                        Start your journey today.
                    </p>
                    <div className="flex gap-4 justify-center pt-4">
                        <Button size="lg" className="h-12 px-8 text-lg shadow-lg shadow-primary/20">Start Free Trial</Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-lg">Book Demo</Button>
                    </div>

                    <div className="pt-16">
                        <div className="relative mx-auto max-w-5xl rounded-xl border bg-background shadow-2xl overflow-hidden aspect-video">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 font-bold text-2xl md:text-4xl">
                                App Interface Preview
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-24 bg-muted/30">
                    <div className="container mx-auto px-6">
                        <h3 className="text-3xl font-bold text-center mb-16">Why Choose {data.name}?</h3>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="bg-background border-none shadow-md hover:shadow-xl transition-shadow">
                                    <CardContent className="p-8 space-y-4">
                                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <Zap className="h-6 w-6" />
                                        </div>
                                        <h4 className="text-xl font-bold">Lightning Fast</h4>
                                        <p className="text-muted-foreground">
                                            Our optimized engine ensures real-time performance at scale.
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t py-12 bg-muted/10 shrink-0">
                <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
                    © 2026 {data.name}. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
