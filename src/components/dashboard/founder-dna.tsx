"use client";

import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Brain, Zap, Fingerprint } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function FounderDnaCard() {
    const { userProfile } = useAuth();

    // MOCK DATA: In V3 this comes from quiz/analysis
    const dnaProfile = {
        archetype: "Visionary Architect",
        strengths: ["Product Vision", "System Design"],
        weaknesses: ["Sales", "Operations"],
        coFounderFit: "Growth Hacker",
        attributes: [
            { label: "Vision", value: 90, color: "bg-purple-500" },
            { label: "Execution", value: 70, color: "bg-blue-500" },
            { label: "Sales", value: 30, color: "bg-orange-500" },
            { label: "Tech", value: 85, color: "bg-green-500" },
        ]
    };

    return (
        <Card className="h-full border-muted/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10" />

            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Fingerprint className="h-5 w-5 text-purple-500" />
                        Founder DNA
                    </CardTitle>
                    <div className="text-xs uppercase font-bold tracking-widest text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full">
                        {dnaProfile.archetype}
                    </div>
                </div>
                <CardDescription>Your unique psychological & skill fingerprint.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    {dnaProfile.attributes.map((attr) => (
                        <div key={attr.label} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                                <span>{attr.label}</span>
                                <span>{attr.value}%</span>
                            </div>
                            <Progress value={attr.value} className="h-1.5" />
                        </div>
                    ))}
                </div>

                <div className="p-3 bg-secondary/50 rounded-lg border border-primary/10">
                    <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                        <Brain className="h-3 w-3" /> AI Recommendation
                    </h4>
                    <p className="text-sm font-medium leading-relaxed">
                        You are a builder at heart. Your biggest risk is "building what no one wants."
                        You need a <span className="text-primary font-bold">{dnaProfile.coFounderFit}</span> co-founder to handle distribution.
                    </p>
                    <Button size="sm" variant="link" className="px-0 text-xs text-primary mt-2 h-auto">
                        Find {dnaProfile.coFounderFit}s <Zap className="h-3 w-3 ml-1" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
