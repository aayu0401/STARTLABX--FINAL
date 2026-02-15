'use client';

import { useState } from 'react';
import { generateRoadmap, type RoadmapOutput } from '@/ai/flows/roadmap-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Map, CheckCircle2, ChevronRight, Code2, Megaphone, Scale, Coins, UserPlus, Box, LineChart } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeIcons: Record<string, any> = {
    tech: Code2,
    marketing: Megaphone,
    legal: Scale,
    fundraising: Coins,
    hiring: UserPlus,
    product: Box,
    business: LineChart
};

const typeColors: Record<string, string> = {
    tech: "text-blue-500 bg-blue-500/10 border-blue-200",
    marketing: "text-pink-500 bg-pink-500/10 border-pink-200",
    legal: "text-slate-500 bg-slate-500/10 border-slate-200",
    fundraising: "text-yellow-500 bg-yellow-500/10 border-yellow-200",
    hiring: "text-green-500 bg-green-500/10 border-green-200",
    product: "text-purple-500 bg-purple-500/10 border-purple-200",
    business: "text-cyan-500 bg-cyan-500/10 border-cyan-200"
};

export function RoadmapTool() {
    const [productName, setProductName] = useState('');
    const [goal, setGoal] = useState('');
    const [timeline, setTimeline] = useState('3 months');
    const [isGenerating, setIsGenerating] = useState(false);
    const [roadmap, setRoadmap] = useState<RoadmapOutput | null>(null);

    const handleGenerate = async () => {
        if (!productName || !goal) return;
        setIsGenerating(true);
        try {
            const res = await generateRoadmap({ productName, goal, timeline });
            setRoadmap(res);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in transition-all">
            {/* Input Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-card p-6 rounded-2xl border shadow-sm">
                <div className="md:col-span-1">
                    <label className="text-xs font-semibold mb-1 block">Startup Name</label>
                    <Input placeholder="Project X" value={productName} onChange={e => setProductName(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                    <label className="text-xs font-semibold mb-1 block">Strategic Goal</label>
                    <Input placeholder="e.g. Launch MVP and get 100 users" value={goal} onChange={e => setGoal(e.target.value)} />
                </div>
                <div>
                    <Button
                        className="w-full bg-gradient-premium shadow-lg"
                        onClick={handleGenerate}
                        disabled={isGenerating || !productName}
                    >
                        {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Map className="mr-2 h-4 w-4" />}
                        Generate Map
                    </Button>
                </div>
            </div>

            {/* Roadmap Display */}
            {roadmap && (
                <div className="relative pt-8 pb-12 w-full overflow-x-auto scrollbar-hide touch-pan-x cursor-grab active:cursor-grabbing">
                    <div className="flex gap-8 md:gap-12 min-w-max px-4 pb-4">
                        {roadmap.phases.map((phase, pIndex) => (
                            <div key={pIndex} className="relative flex flex-col gap-6 w-[85vw] md:w-80 animate-in slide-in-from-bottom-10" style={{ animationDelay: `${pIndex * 200}ms` }}>
                                {/* Phase Header */}
                                <div className="flex items-center gap-3 border-b pb-2 mb-2 sticky left-0">
                                    <span className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm shadow-sm ring-2 ring-background">
                                        {pIndex + 1}
                                    </span>
                                    <h3 className="font-bold text-lg whitespace-nowrap">{phase.name}</h3>
                                </div>

                                {/* Milestones */}
                                <div className="space-y-4 relative">
                                    {/* Vertical Line */}
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border -z-10" />

                                    {phase.milestones.map((ms, mIndex) => {
                                        const Icon = typeIcons[ms.type] || CheckCircle2;
                                        const colorClass = typeColors[ms.type] || "text-gray-500 bg-gray-100";

                                        return (
                                            <Card key={mIndex} className="ml-0 relative overflow-hidden group hover:shadow-lg transition-all border-l-4" style={{ borderLeftColor: 'currentColor' }}>
                                                <div className="p-4 flex gap-4">
                                                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border", colorClass)}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-bold text-sm">{ms.title}</h4>
                                                            <span className="text-[10px] uppercase font-bold text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                                                                W{ms.week}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1 leading-snug">
                                                            {ms.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>

                                {/* Connector to next phase */}
                                {pIndex < roadmap.phases.length - 1 && (
                                    <div className="absolute -right-6 top-1/2 hidden md:block text-muted-foreground/30">
                                        <ChevronRight className="h-8 w-8" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!roadmap && !isGenerating && (
                <div className="text-center py-20 opacity-50">
                    <Map className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-bold text-muted-foreground">Strategic Roadmap Empty</h3>
                    <p>Define your goal to generate a path to success.</p>
                </div>
            )}
        </div>
    );
}
