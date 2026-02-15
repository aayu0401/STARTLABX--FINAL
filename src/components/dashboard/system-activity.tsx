'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Zap, Users, Briefcase, BrainCircuit, MessageSquare, ShieldAlert } from 'lucide-react';
import realtimeService from '@/services/realtime.service';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Activity {
    id: string;
    type: 'ai' | 'hiring' | 'social' | 'system' | 'match';
    title: string;
    message: string;
    timestamp: Date;
    priority?: 'low' | 'medium' | 'high';
}

export function SystemActivity() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const addActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
        setActivities(prev => [
            {
                ...activity,
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date()
            },
            ...prev.slice(0, 19) // Keep last 20
        ]);
    };

    useEffect(() => {
        // Mock some initial activities
        setActivities([
            { id: '1', type: 'system', title: 'System Engine Online', message: 'Hyper-latency real-time engine connected successfully.', timestamp: new Date(), priority: 'low' },
            { id: '2', type: 'ai', title: 'Cortex Node 07 Active', message: 'AI Studio LLM context loaded and ready for generation.', timestamp: new Date(Date.now() - 1000 * 60 * 5), priority: 'low' },
            { id: '3', type: 'match', title: 'Smart Match Indexing', message: 'Recalibrating talent-founder affinity vectors.', timestamp: new Date(Date.now() - 1000 * 60 * 12), priority: 'medium' },
            { id: '4', type: 'social', title: 'Global Feed Synced', message: '12 new achievements broadcasted in the last hour.', timestamp: new Date(Date.now() - 1000 * 60 * 30), priority: 'low' }
        ]);

        // Interval to simulate live app behavior
        const interval = setInterval(() => {
            const types: Activity['type'][] = ['ai', 'hiring', 'social', 'system', 'match'];
            const randomType = types[Math.floor(Math.random() * types.length)];
            const messages = {
                ai: ['Cortex analyzed a new pitch deck.', 'Idea validation score: 87/100.', 'Drafting equity agreement...'],
                hiring: ['New Senior Dev match found.', 'Interview scheduled for Nebula AI.', 'Talent pipeline updated.'],
                social: ['Post reached 1k views.', 'Community "SaaS Founders" added a new event.', 'New like on your milestone.'],
                system: ['Node performance optimized.', 'Database migration complete.', 'Security audit: 0 threats.'],
                match: ['Found a potential Co-Founder.', 'Compatibility score: 94%.', 'Skills gap analysis complete.'],
            };
            const typeMsgs = messages[randomType as keyof typeof messages];

            addActivity({
                type: randomType,
                title: randomType.toUpperCase() + ' Event',
                message: typeMsgs[Math.floor(Math.random() * typeMsgs.length)],
                priority: Math.random() > 0.8 ? 'high' : 'medium'
            });
        }, 15000); // Every 15 seconds

        // Listen for real-time events to populate activity stream
        const unsubOpp = realtimeService.on('new_opportunity', (data) => {
            addActivity({
                type: 'hiring',
                title: 'New Opportunity',
                message: `${data.role} position has been posted live.`,
                priority: 'medium'
            });
        });

        const unsubNotify = realtimeService.on('new_notification', (data) => {
            addActivity({
                type: data.type === 'match' ? 'match' : 'social',
                title: data.title,
                message: data.message,
                priority: data.type === 'match' ? 'high' : 'medium'
            });
        });

        const unsubProcessingStart = realtimeService.on('processing_start', () => {
            addActivity({
                type: 'ai',
                title: 'AI Processing',
                message: 'A heavy compute task has been initialized.',
                priority: 'medium'
            });
        });

        return () => {
            clearInterval(interval);
            unsubOpp();
            unsubNotify();
            unsubProcessingStart();
        };
    }, []);

    const getIcon = (type: Activity['type']) => {
        switch (type) {
            case 'ai': return <BrainCircuit className="h-4 w-4 text-primary" />;
            case 'hiring': return <Briefcase className="h-4 w-4 text-blue-500" />;
            case 'match': return <Zap className="h-4 w-4 text-yellow-500" />;
            case 'social': return <MessageSquare className="h-4 w-4 text-purple-500" />;
            default: return <ShieldAlert className="h-4 w-4 text-muted-foreground" />;
        }
    };

    return (
        <Card className="h-full border-muted/40 shadow-sm flex flex-col overflow-hidden bg-background/50 backdrop-blur-sm">
            <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Command Center</CardTitle>
                        <CardDescription>Live system activity stream</CardDescription>
                    </div>
                    <Badge variant="outline" className="animate-pulse bg-green-500/5 text-green-500 border-green-500/20">
                        Live
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[400px]">
                    <div className="p-4 space-y-4">
                        {activities.map((activity) => (
                            <div key={activity.id} className="relative pl-6 pb-4 border-l border-muted group last:pb-0">
                                <div className={cn(
                                    "absolute left-[-9px] top-1 h-4 w-4 rounded-full border-4 border-background flex items-center justify-center transition-all group-hover:scale-125",
                                    activity.priority === 'high' ? 'bg-yellow-500' :
                                        activity.priority === 'medium' ? 'bg-primary' : 'bg-muted-foreground'
                                )} />
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        {getIcon(activity.type)}
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            {activity.type}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground ml-auto">
                                            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                                        </span>
                                    </div>
                                    <h4 className="text-sm font-semibold">{activity.title}</h4>
                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                        {activity.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t bg-muted/20">
                    <button
                        onClick={() => setActivities([])}
                        className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                    >
                        Clear Terminal
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
