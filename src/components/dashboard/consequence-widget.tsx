"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardData } from "@/services/dashboard.service";
import { Lock, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function ConsequenceWidget({ data }: { data: DashboardData }) {
    if (!data.traction) return null;
    const score = data.traction.score;
    const risk = data.riskAnalysis;

    const features = [
        { label: "Talent: Groth Hackers", unlockAt: 40, icon: "🦄" },
        { label: "Angel Visibility", unlockAt: 50, icon: "😇" },
        { label: "VC Deal Flow", unlockAt: 70, icon: "💰" },
        { label: "Launch Feed Feature", unlockAt: 80, icon: "🚀" }
    ];

    return (
        <Card className={cn("h-full border-muted/40 relative overflow-hidden", risk?.riskLevel === 'high' ? 'border-red-500/50 bg-red-500/5' : '')}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        {risk?.riskLevel === 'high' ? <AlertTriangle className="h-5 w-5 text-red-500" /> : <ShieldCheck className="h-5 w-5 text-primary" />}
                        Startup Status
                    </CardTitle>
                    {risk?.riskLevel === 'high' && (
                        <Badge variant="destructive" className="animate-pulse">CRITICAL RISK</Badge>
                    )}
                </div>
                <CardDescription>
                    {risk?.riskLevel === 'high'
                        ? "Execution Warning: You are building features without validation."
                        : "Unlock platform power by shipping."}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Risk Warning Block */}
                {risk?.riskLevel === 'high' && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <h4 className="text-red-500 font-bold text-sm mb-1">⚠️ {risk.recommendation}</h4>
                        <ul className="text-xs text-red-400 list-disc list-inside">
                            {risk.factors.map(f => <li key={f}>{f}</li>)}
                        </ul>
                    </div>
                )}

                {/* Feature Locks */}
                <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Level {Math.floor(score / 10)} Privileges</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {features.map((f) => {
                            const isUnlocked = score >= f.unlockAt;
                            return (
                                <div key={f.label} className={cn(
                                    "flex items-center gap-2 p-2 rounded border text-xs font-medium transition-colors",
                                    isUnlocked
                                        ? "bg-green-500/10 border-green-500/20 text-green-500"
                                        : "bg-muted/50 border-muted text-muted-foreground opacity-70"
                                )}>
                                    {isUnlocked ? <Zap className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                    <span>{f.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Next Milestone */}
                <div className="pt-2">
                    <Button variant={risk?.riskLevel === 'high' ? 'destructive' : 'outline'} className="w-full h-8 text-xs font-bold">
                        {risk?.riskLevel === 'high' ? 'Start Pivoting Now' : 'View Unlock Criteria'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
