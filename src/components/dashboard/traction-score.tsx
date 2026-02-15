"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Rocket, TrendingUp, Code, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TractionMetrics {
    score: number;
    development: number;
    market: number;
    team: number;
}

export function TractionScore({ metrics }: { metrics: TractionMetrics }) {
    if (!metrics) return null;

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500";
        if (score >= 50) return "text-yellow-500";
        return "text-red-500";
    };

    const getPhase = (score: number) => {
        if (score >= 80) return "Growth";
        if (score >= 50) return "Validation";
        return "Ideation";
    };

    return (
        <Card className="h-full border-muted/40 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-colors duration-500" />

            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Rocket className="h-5 w-5 text-primary" />
                        Traction Score
                    </CardTitle>
                    <Badge variant="outline" className={cn("uppercase tracking-widest font-bold", getScoreColor(metrics.score))}>
                        {getPhase(metrics.score)} Phase
                    </Badge>
                </div>
                <CardDescription>Real-time execution velocity & validation signals.</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex items-center justify-center py-6 relative">
                    {/* Circular Score Placeholder (Simple for now) */}
                    <div className="relative flex flex-col items-center">
                        <span className={cn("text-6xl font-black tracking-tighter", getScoreColor(metrics.score))}>
                            {metrics.score}
                        </span>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] mt-2">
                            / 100
                        </span>
                    </div>
                </div>

                <div className="space-y-4 mt-2">
                    {/* Development Velocity */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 font-medium text-muted-foreground"><Code className="h-3 w-3" /> Dev Velocity</span>
                            <span className="font-bold">{metrics.development}%</span>
                        </div>
                        <Progress value={metrics.development} className="h-1.5" />
                    </div>

                    {/* Market Validation */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 font-medium text-muted-foreground"><TrendingUp className="h-3 w-3" /> Market Signals</span>
                            <span className="font-bold">{metrics.market}%</span>
                        </div>
                        <Progress value={metrics.market} className="h-1.5" />
                    </div>

                    {/* Team Completeness */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 font-medium text-muted-foreground"><Users className="h-3 w-3" /> Team Core</span>
                            <span className="font-bold">{metrics.team}%</span>
                        </div>
                        <Progress value={metrics.team} className="h-1.5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
