'use client';

import { useState, useEffect } from 'react';
import { Talent } from './types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BrainCircuit, Check, X, Zap, Trophy, Briefcase, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import realtimeService from '@/services/realtime.service';
import { useAuth } from '@/contexts/auth-context';
import { MatchmakerAgent, MatchAnalysis } from '@/lib/agents/matchmaker-agent';
import { incubatorService, StartupProject } from '@/services/incubator.service';
import subscriptionService from '@/services/subscription.service';
import { Lock } from 'lucide-react';

interface NeuroMatchProps {
    data: Talent[];
}

export function NeuroMatch({ data }: NeuroMatchProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [matchData, setMatchData] = useState<MatchAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right' | null>(null);
    const [activeProject, setActiveProject] = useState<StartupProject | null>(null);
    const [isPremium, setIsPremium] = useState(false);

    const candidate = data[currentIndex];

    // Load active project context & subscription
    useEffect(() => {
        const loadContext = async () => {
            try {
                const [projects, sub] = await Promise.all([
                    incubatorService.getProjects(),
                    subscriptionService.getCurrentSubscription()
                ]);
                if (projects.length > 0) setActiveProject(projects[0]);
                setIsPremium(sub.plan === 'founder' || sub.plan === 'professional' || sub.plan === 'starter');
            } catch (e) { console.error("Failed to load context", e); }
        };
        loadContext();
    }, []);

    // Analyze Fit when candidate changes
    useEffect(() => {
        if (candidate && activeProject) {
            setIsAnalyzing(true);
            setMatchData(null);

            const analyze = async () => {
                const analysis = await MatchmakerAgent.analyzeFit(
                    activeProject.description || activeProject.name,
                    activeProject.techStack || {},
                    candidate as any
                );

                // Add artificial delay for "Neural" feel
                setTimeout(() => {
                    setMatchData(analysis);
                    setIsAnalyzing(false);
                }, 1500);
            };

            analyze();
        } else if (candidate && !activeProject) {
            // Fallback if no project
            setIsAnalyzing(true);
            setTimeout(() => {
                setMatchData({ score: 85, reasoning: "Generic Match Profile", pros: [], cons: [] });
                setIsAnalyzing(false);
            }, 1000);
        }
    }, [candidate, activeProject]);

    const { user } = useAuth();

    const handleSwipe = (dir: 'left' | 'right') => {
        setDirection(dir);

        if (dir === 'right' && candidate) {
            // Real-time notification to the candidate
            realtimeService.send('send_notification', {
                userId: candidate.id,
                title: 'Neural Match! 🧠',
                message: `${user?.name || 'A Founder'} is impressed by your profile. Start a conversation!`,
                type: 'match'
            });
        }

        setTimeout(() => {
            setDirection(null);
            if (currentIndex < data.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                // Reset or finish
                setCurrentIndex(0);
            }
        }, 400);
    };

    if (!candidate) return <div className="text-center p-20 text-muted-foreground">No more candidates within your neural network.</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[600px] w-full max-w-2xl mx-auto relative perspective-1000 py-6">

            {/* Neural Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl z-0" />

            {/* Main Card */}
            <div
                className={cn(
                    "relative w-full z-10 transition-all duration-500 transform preserve-3d",
                    direction === 'left' ? "-translate-x-full rotate-[-20deg] opacity-0" : "",
                    direction === 'right' ? "translate-x-full rotate-[20deg] opacity-0" : "",
                    isAnalyzing ? "scale-95 blur-[1px]" : "scale-100"
                )}
            >
                <Card className="overflow-hidden border-2 border-primary/20 shadow-[0_0_50px_rgba(var(--primary),0.1)] bg-background/80 backdrop-blur-xl rounded-[3rem]">
                    {/* Header: Match Score */}
                    <div className="absolute top-6 right-6 z-20 flex flex-col items-center">
                        <div className={cn(
                            "h-20 w-20 rounded-full flex items-center justify-center border-4 text-2xl font-black shadow-lg transition-all duration-1000",
                            isAnalyzing ? "border-muted bg-muted text-transparent" : "border-green-500 bg-green-500/10 text-green-500"
                        )}>
                            {isAnalyzing ? <Zap className="h-8 w-8 animate-spin text-muted-foreground" /> : `${matchData?.score || 0}%`}
                        </div>
                        {!isAnalyzing && <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 mt-2 bg-green-100 px-2 py-0.5 rounded-full">Synergy</span>}
                    </div>

                    {/* Hero Image */}
                    <div className="h-64 bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30" />
                        <div className="absolute bottom-[-3rem] left-8 border-4 border-background rounded-3xl overflow-hidden shadow-2xl h-32 w-32 bg-white">
                            <Avatar className="h-full w-full">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.id}`} className="object-cover" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="pt-16 pb-8 px-8">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-3xl font-bold">{candidate.name}</h2>
                                <p className="text-lg text-primary font-medium flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" /> {candidate.title}
                                </p>
                            </div>
                            <div className="text-right mt-2">
                                <p className="text-2xl font-bold">${candidate.hourlyRate}/hr</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Est. Rate</p>
                            </div>
                        </div>

                        <div className="flex gap-2 mb-6 flex-wrap">
                            <Badge variant="secondary" className="px-3 py-1 text-sm bg-blue-500/10 text-blue-600 border-blue-200">
                                <MapPin className="h-3 w-3 mr-1" /> {candidate.location}
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1 text-sm bg-purple-500/10 text-purple-600 border-purple-200">
                                <Trophy className="h-3 w-3 mr-1" /> Top Rated
                            </Badge>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div>
                                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Core Competencies</h4>
                                <div className="flex flex-wrap gap-2">
                                    {candidate.skills.map((skill, i) => (
                                        <Badge key={i} variant="outline" className="border-primary/20">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="relative overflow-hidden rounded-lg mt-4">
                                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">AI Analysis</h4>
                                <div className={cn("text-sm italic text-muted-foreground bg-secondary/50 p-3 rounded-lg border-l-2 border-primary", !isPremium && "blur-sm select-none")}>
                                    {matchData?.reasoning || "Analyzing compatibility matrix..."}
                                </div>
                                {!isPremium && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                                        <Button size="sm" variant="secondary" className="shadow-lg gap-2" onClick={() => window.location.href = '/subscription'}>
                                            <Lock className="h-3 w-3" /> Upgrade to View
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-6">
                            <Button
                                variant="outline"
                                className="h-16 rounded-2xl border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all text-lg font-bold"
                                onClick={() => handleSwipe('left')}
                            >
                                <X className="mr-2 h-6 w-6" /> Pass
                            </Button>
                            <Button
                                className="h-16 rounded-2xl bg-gradient-premium shadow-lg shadow-primary/25 hover:shadow-primary/50 hover:scale-[1.02] transition-all text-lg font-bold"
                                onClick={() => handleSwipe('right')}
                            >
                                <BrainCircuit className="mr-2 h-6 w-6" /> Connect
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Stack Effect Behind */}
            <div className="absolute top-4 w-[95%] h-full bg-background/50 border border-border/50 rounded-[3rem] -z-10 scale-95 blur-[2px]" />
            <div className="absolute top-8 w-[90%] h-full bg-background/30 border border-border/30 rounded-[3rem] -z-20 scale-90 blur-[4px]" />
        </div>
    );
}
