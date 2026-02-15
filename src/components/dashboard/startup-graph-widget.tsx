"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, History, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

interface PivotHistory {
    id: string;
    previousStage: string;
    newStage: string;
    reason: string;
    date: string;
}

interface DefensibilityMoat {
    score: number;
    networkEffects: number;
    brand: number;
    tech: number;
    data: number;
}

export function StartupGraphWidget({ pivots, moat }: { pivots?: PivotHistory[]; moat?: DefensibilityMoat }) {
    if (!moat && !pivots) return null;

    return (
        <Card className="h-full border-muted/40 relative overflow-hidden bg-gradient-to-br from-background to-purple-500/5">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <BrainCircuit className="h-5 w-5 text-purple-500" />
                        Knowledge Graph
                    </CardTitle>
                    {moat && (
                        <Badge variant="outline" className="border-purple-500/30 text-purple-600">
                            Moat Score: {moat.score}/100
                        </Badge>
                    )}
                </div>
                <CardDescription>Learning from your pivots & data accumulation.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Moat Visualization */}
                {moat && (
                    <div className="grid grid-cols-4 gap-1 text-center">
                        <div className="bg-card/50 p-2 rounded border">
                            <div className="text-[10px] text-muted-foreground uppercase">Network</div>
                            <div className="font-bold text-purple-600">{moat.networkEffects}</div>
                        </div>
                        <div className="bg-card/50 p-2 rounded border">
                            <div className="text-[10px] text-muted-foreground uppercase">Brand</div>
                            <div className="font-bold text-pink-600">{moat.brand}</div>
                        </div>
                        <div className="bg-card/50 p-2 rounded border">
                            <div className="text-[10px] text-muted-foreground uppercase">Tech</div>
                            <div className="font-bold text-blue-600">{moat.tech}</div>
                        </div>
                        <div className="bg-card/50 p-2 rounded border">
                            <div className="text-[10px] text-muted-foreground uppercase">Data</div>
                            <div className="font-bold text-green-600">{moat.data}</div>
                        </div>
                    </div>
                )}

                {/* Pivot History */}
                {pivots && pivots.length > 0 && (
                    <div className="relative pl-4 border-l-2 border-muted">
                        <div className="absolute top-0 -left-[5px] w-2 h-2 rounded-full bg-muted-foreground" />
                        {pivots.map((pivot) => (
                            <div key={pivot.id} className="mb-4 last:mb-0">
                                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-2">
                                    <History className="h-3 w-3" /> {new Date(pivot.date).toLocaleDateString()}
                                </div>
                                <div className="text-sm font-medium">
                                    Pivoted from <span className="text-red-500 line-through">{pivot.previousStage}</span> to <span className="text-green-600 font-bold">{pivot.newStage}</span>
                                </div>
                                <div className="text-xs text-muted-foreground italic mt-1">
                                    "{pivot.reason}"
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
