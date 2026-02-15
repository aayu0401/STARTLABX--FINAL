'use client';

import { useState } from 'react';
import { simulateVCPitch, type VCSimulationOutput } from '@/ai/flows/vc-simulation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, ThumbsUp, ThumbsDown, DollarSign, AlertTriangle } from 'lucide-react';

export function VCSimulator() {
    const [pitch, setPitch] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<VCSimulationOutput | null>(null);

    const handlePitch = async () => {
        if (!pitch.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const response = await simulateVCPitch({
                startupName: 'My Startup', // Could be dynamic input
                pitchText: pitch,
                stage: 'Seed'
            });
            setResult(response);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {/* Left: Interactions */}
            <div className="md:col-span-2 space-y-6">
                <Card className="glass-card p-6 border-primary/20 bg-gradient-to-br from-background to-secondary/10">
                    <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-16 w-16 border-2 border-primary shadow-lg">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=SarahVC" />
                            <AvatarFallback>VC</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-bold">Sarah Sterling</h3>
                            <p className="text-sm text-muted-foreground">Partner @ Horizon Ventures</p>
                            <Badge variant="outline" className="mt-1 bg-green-500/10 text-green-600 border-green-200">
                                Active Investing
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-xl rounded-tl-none">
                            <p className="text-sm">
                                "Hello! I'm looking for the next unicorn in AI or SaaS. Give me your 30-second elevator pitch. Be concise, I have a board meeting in 5 minutes."
                            </p>
                        </div>

                        {result && (
                            <div className="bg-primary/5 p-4 rounded-xl rounded-tl-none border border-primary/10 animate-in slide-in-from-left-5">
                                <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                    {result.decision === 'Meeting' ? <ThumbsUp className="h-4 w-4 text-green-500" /> : <ThumbsDown className="h-4 w-4 text-red-500" />}
                                    Verdict: <span className={result.decision === 'Meeting' ? 'text-green-600' : 'text-red-600'}>{result.decision}</span>
                                </h4>
                                <p className="text-sm italic text-foreground/80">"{result.feedback}"</p>

                                {result.termSheetOffer && (
                                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-3">
                                        <DollarSign className="h-5 w-5 text-yellow-600" />
                                        <div>
                                            <p className="text-xs font-bold text-yellow-700 uppercase">Term Sheet Offer</p>
                                            <p className="text-sm font-medium text-yellow-800">{result.termSheetOffer}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {loading && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                                <Loader2 className="h-4 w-4 animate-spin" /> Sarah is analyzing your pitch...
                            </div>
                        )}
                    </div>
                </Card>

                <Card className="p-4 border-t shadow-sm">
                    <div className="flex gap-4">
                        <Textarea
                            placeholder="Pitch your startup here..."
                            className="min-h-[80px] resize-none border-primary/20 focus-visible:ring-primary"
                            value={pitch}
                            onChange={(e) => setPitch(e.target.value)}
                        />
                        <Button
                            size="icon"
                            className="h-auto w-16 bg-gradient-premium shadow-lg hover:shadow-xl transition-all"
                            onClick={handlePitch}
                            disabled={loading || !pitch.trim()}
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Right: Analysis */}
            <div className="space-y-4">
                <Card className="p-6 h-full border-muted bg-card/50">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-4">Live Analysis</h4>

                    {result ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center h-24 w-24 rounded-full border-4 border-primary/20 relative">
                                    <span className="text-3xl font-black text-primary">{result.score}</span>
                                    <span className="absolute bottom-2 text-[10px] text-muted-foreground uppercase">Score</span>
                                </div>
                            </div>

                            <div>
                                <h5 className="text-xs font-bold mb-2 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3 text-orange-500" /> Key Concerns
                                </h5>
                                <ul className="space-y-2">
                                    {result.keyConcerns.map((concern, i) => (
                                        <li key={i} className="text-xs px-2 py-1 bg-red-500/10 text-red-600 rounded border border-red-500/20">
                                            {concern}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                            <div className="h-12 w-12 rounded-full bg-gray-200 mb-2 animate-pulse" />
                            <p className="text-xs">Waiting for pitch data...</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
