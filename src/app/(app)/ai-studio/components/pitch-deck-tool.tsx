'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generatePitchDeck, type Slide } from '@/ai/flows/pitch-deck-generator';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowRight, ArrowLeft, Download, RefreshCw, Presentation, MonitorPlay } from 'lucide-react';

const formSchema = z.object({
    startupName: z.string().min(2, "Startup name is required"),
    description: z.string().min(10, "Provide a description"),
    targetAudience: z.string().min(5, "Define your audience"),
});

export function PitchDeckTool() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [mode, setMode] = useState<'form' | 'view'>('form');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            startupName: '',
            description: '',
            targetAudience: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsGenerating(true);
        try {
            const result = await generatePitchDeck(values);
            if (result && result.slides) {
                setSlides(result.slides);
                setMode('view');
                setCurrentSlideIndex(0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    }

    const nextSlide = () => {
        if (currentSlideIndex < slides.length - 1) setCurrentSlideIndex(prev => prev + 1);
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) setCurrentSlideIndex(prev => prev - 1);
    };

    if (mode === 'form') {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in fade-in slide-in-from-bottom-5">
                <div>
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 mb-2">
                            AI Pitch Deck Architect
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Transform your raw idea into an investor-ready presentation structure in seconds.
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="startupName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Startup Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Acme AI" className="h-12 bg-secondary/50" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Core Concept</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="What are you building and why?" className="min-h-[100px] bg-secondary/50 resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="targetAudience"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Target Audience</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Enterprise HR Managers" className="h-12 bg-secondary/50" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" size="lg" className="w-full h-14 text-lg gap-2 shadow-xl hover:shadow-primary/20 transition-all font-bold" disabled={isGenerating}>
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Architecting Deck...
                                    </>
                                ) : (
                                    <>
                                        <Presentation className="mr-2 h-5 w-5" /> Generate Deck Template
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>

                {/* Hero Visual */}
                <div className="hidden lg:flex justify-center">
                    <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8 text-center group">
                        <div className="absolute inset-0 bg-grid-white/5 mask-gradient-to-b" />
                        <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-lg mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <MonitorPlay className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Investor Grade</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                            Structure<br />Narrative Flow<br />Market Sizing<br />Competitor Grid
                        </p>
                        <div className="mt-8 flex gap-2">
                            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse delay-75" />
                            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse delay-150" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // View Mode
    const currentSlide = slides[currentSlideIndex];

    return (
        <div className="flex flex-col h-[70vh] animate-in zoom-in-95 duration-500">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6 px-1">
                <Button variant="ghost" onClick={() => setMode('form')} className="gap-2 text-muted-foreground hover:text-foreground">
                    <RefreshCw className="h-4 w-4" /> Reset
                </Button>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground">
                        Slide {currentSlideIndex + 1} of {slides.length}
                    </span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={prevSlide} disabled={currentSlideIndex === 0}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={nextSlide} disabled={currentSlideIndex === slides.length - 1}>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button variant="default" className="gap-2 bg-gradient-premium shadow-lg">
                        <Download className="h-4 w-4" /> Export PDF
                    </Button>
                </div>
            </div>

            {/* Slide Viewer */}
            <div className="flex-1 w-full bg-black/80 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden relative group">
                {/* Background Image with Overlay */}
                {currentSlide.imageUrl && (
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={currentSlide.imageUrl} alt="Slide Background" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" />
                    </div>
                )}

                {/* Content */}
                <div className="absolute inset-0 z-20 p-12 lg:p-20 flex flex-col justify-center max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 w-fit mb-6 text-xs text-blue-200 font-mono tracking-widest uppercase">
                        {/* Breadcrumb / Tag */}
                        StartLabX Confidential
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white mb-8 leading-tight drop-shadow-2xl">
                        {currentSlide.title}
                    </h1>

                    <ul className="space-y-6">
                        {currentSlide.bulletPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-4 text-xl lg:text-2xl text-gray-200 font-light animate-in slide-in-from-left-10 fade-in fill-mode-forwards" style={{ animationDelay: `${i * 100}ms` }}>
                                <span className="h-2 w-2 rounded-full bg-blue-500 mt-3 shrink-0 shadow-[0_0_10px_#3b82f6]" />
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer Branding */}
                <div className="absolute bottom-8 right-8 z-20 opacity-50">
                    <div className="flex items-center gap-2 text-white">
                        <MonitorPlay className="h-6 w-6" />
                        <span className="font-bold tracking-widest">SLX STUDIO</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
