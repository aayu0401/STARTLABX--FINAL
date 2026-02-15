
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Check, X, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface DailyAction {
    id: string;
    content: string;
    status: 'pending' | 'completed' | 'missed' | 'carried_over';
}

interface FounderRhythmData {
    executionStreak: number;
    executionDebt: number;
    todaysAction?: DailyAction;
}

export function FounderRhythmWidget({ data }: { data: FounderRhythmData }) {
    const [action, setAction] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleLockIn = async () => {
        if (!action) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/founder/rhythm', {
                // Wait, I created /api/founder/rhythm/route.ts. So the path is /api/founder/rhythm.
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'create', action })
            });
            if (res.ok) {
                setAction("");
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleComplete = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/founder/rhythm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'complete' })
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="h-full border-muted/40 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -z-10" />

            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Flame className={cn("h-5 w-5", data.executionStreak > 3 ? "text-orange-500 animate-pulse" : "text-muted-foreground")} />
                        Operating Rhythm
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {data.executionDebt > 0 && (
                            <Badge variant="outline" className="border-red-500/30 text-red-500 bg-red-500/5">
                                {data.executionDebt} Debt
                            </Badge>
                        )}
                        <Badge variant="secondary" className="font-mono">
                            {data.executionStreak} Day Streak
                        </Badge>
                    </div>
                </div>
                <CardDescription>Daily execution discipline.</CardDescription>
            </CardHeader>

            <CardContent>
                {data.todaysAction ? (
                    <div className="space-y-4">
                        <div className="bg-card/50 border rounded-lg p-4">
                            <div className="text-xs uppercase text-muted-foreground font-bold mb-2 flex items-center gap-2">
                                <Target className="w-3 h-3" />
                                Today's Top 1 Action
                            </div>
                            <div className="text-lg font-medium mb-4">
                                "{data.todaysAction.content}"
                            </div>

                            {data.todaysAction.status === 'pending' ? (
                                <div className="flex gap-2">
                                    <Button
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                        onClick={handleComplete}
                                        disabled={isSubmitting}
                                    >
                                        <Check className="w-4 h-4 mr-2" /> Mark Done
                                    </Button>
                                    <Button variant="outline" className="flex-1 text-muted-foreground">
                                        <Clock className="w-4 h-4 mr-2" /> Delay
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-green-500 flex items-center gap-2 text-sm font-medium bg-green-500/10 p-2 rounded">
                                    <Check className="w-4 h-4" /> Completed
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="text-sm text-muted-foreground">
                            What is the <b>single most important thing</b> you must ship today?
                        </div>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 bg-background border rounded px-3 py-2 text-sm"
                                placeholder="e.g. Call 5 customers..."
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <Button
                                size="sm"
                                disabled={!action || isSubmitting}
                                onClick={handleLockIn}
                            >
                                {isSubmitting ? "Locking..." : "Lock In"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Micro-Interaction / Motivational Text */}
                <div className="mt-4 text-[10px] text-center text-muted-foreground">
                    "Consistent execution beats intensity."
                </div>
            </CardContent>
        </Card>
    );
}
