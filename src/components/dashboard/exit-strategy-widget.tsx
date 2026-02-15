"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DoorOpen, TrendingUp, AlertCircle } from "lucide-react";

interface ExitStrategy {
    acquisitionScore: number;
    buyerTypes: string[];
    readinessGaps: string[];
}

export function ExitStrategyWidget({ strategy }: { strategy?: ExitStrategy }) {
    if (!strategy) return null;

    return (
        <Card className="h-full border-muted/40 relative overflow-hidden bg-gradient-to-br from-background to-blue-500/5">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <DoorOpen className="h-5 w-5 text-blue-500" />
                        Exit Strategy
                    </CardTitle>
                    <Badge variant="outline" className={`border-blue-500/30 text-blue-600 ${strategy.acquisitionScore > 70 ? 'bg-green-500/10 text-green-600 border-green-500/30' : ''}`}>
                        Score: {strategy.acquisitionScore}/100
                    </Badge>
                </div>
                <CardDescription>Acquisition readiness & buyer matching.</CardDescription>
            </CardHeader>

            <CardContent>
                {/* Score Dial */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-muted/20" />
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={175} strokeDashoffset={175 - (175 * strategy.acquisitionScore) / 100} className="text-blue-500 transition-all duration-1000 ease-out" />
                        </svg>
                        <span className="absolute text-sm font-bold">{strategy.acquisitionScore}</span>
                    </div>
                    <div>
                        <div className="text-xs uppercase text-muted-foreground font-bold">Most Likely Buyer</div>
                        <div className="text-lg font-bold">{strategy.buyerTypes[0]}</div>
                    </div>
                </div>

                {/* Gaps */}
                <div className="space-y-2">
                    <div className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Critical Gaps
                    </div>
                    {strategy.readinessGaps.slice(0, 2).map((gap) => (
                        <div key={gap} className="flex items-center gap-2 text-sm text-red-400 bg-red-500/5 p-2 rounded border border-red-500/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {gap}
                        </div>
                    ))}
                </div>

                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs text-muted-foreground hover:text-primary">
                    View Full Analysis
                </Button>
            </CardContent>
        </Card>
    );
}
