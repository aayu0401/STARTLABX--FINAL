"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Play, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BoardMeeting {
    id: string;
    weekNumber: number;
    date: string;
    status: 'completed' | 'pending';
    sentiment: 'optimistic' | 'concerned' | 'neutral';
    aiFeedback: string;
}

export function BoardMeetingWidget({ meetings }: { meetings?: BoardMeeting[] }) {
    if (!meetings || meetings.length === 0) return null;

    const nextMeeting = meetings.find(m => m.status === 'pending') || meetings[0];
    const isPending = nextMeeting.status === 'pending';

    return (
        <Card className="h-full border-muted/40 relative overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <CalendarCheck className="h-5 w-5 text-primary" />
                        AI Board Meeting
                    </CardTitle>
                    {isPending && (
                        <Badge variant="secondary" className="animate-pulse bg-primary/10 text-primary hover:bg-primary/20">
                            Upcoming
                        </Badge>
                    )}
                </div>
                <CardDescription>Weekly accountability & strategy session.</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="bg-card/50 border rounded-lg p-4 mb-4">
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                        Week {nextMeeting.weekNumber} • {new Date(nextMeeting.date).toLocaleDateString(undefined, { weekday: 'long' })}
                    </div>
                    <div className="font-bold text-lg mb-2">
                        {isPending ? "Ready to start?" : "Audit Complete"}
                    </div>
                    {isPending ? (
                        <Button className="w-full gap-2">
                            <Play className="h-4 w-4" /> Start Meeting
                        </Button>
                    ) : (
                        <div className="text-sm text-muted-foreground italic">
                            "{nextMeeting.aiFeedback}"
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="text-xs font-bold uppercase text-muted-foreground">Previous Sessions</div>
                    {meetings.filter(m => m.status === 'completed').slice(0, 2).map((m) => (
                        <div key={m.id} className="flex items-center justify-between text-sm p-2 rounded bg-muted/20">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                <span>Week {m.weekNumber}</span>
                            </div>
                            <Badge variant="outline" className={cn("text-[10px] h-5",
                                m.sentiment === 'optimistic' ? 'text-green-500 border-green-500/30' :
                                    m.sentiment === 'concerned' ? 'text-red-500 border-red-500/30' : 'text-yellow-500 border-yellow-500/30'
                            )}>
                                {m.sentiment}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
