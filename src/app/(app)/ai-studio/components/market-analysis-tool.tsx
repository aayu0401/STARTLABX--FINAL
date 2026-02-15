"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { analyzeMarket } from '@/ai/flows/market-analysis';
import { Loader2, TrendingUp, ShieldAlert, MessageSquare } from 'lucide-react';

export function MarketAnalysisTool() {
    const [industry, setIndustry] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleAnalyze = async () => {
        if (!industry || !location) return;
        setLoading(true);
        try {
            const res = await analyzeMarket({ industry, location });
            setResult(res);
        } catch (e) {
            console.error('Market analysis Error:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="glass shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="text-blue-500" />
                    Market Intelligence Analyzer
                </CardTitle>
                <CardDescription>Get AI-powered insights into any market sector and geographic location.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Industry</label>
                        <Input
                            placeholder="e.g. Fintech, E-commerce"
                            value={industry}
                            onChange={e => setIndustry(e.target.value)}
                            className="bg-background/50"
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Target Region</label>
                        <Input
                            placeholder="e.g. United Kingdom, Global"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            className="bg-background/50"
                        />
                    </div>
                </div>
                <Button
                    onClick={handleAnalyze}
                    disabled={loading || !industry || !location}
                    className="w-full gradient-primary h-12 text-md font-bold"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mr-2 h-5 w-5" />
                            Analyzing Market Dynamics...
                        </>
                    ) : (
                        <>
                            <TrendingUp className="mr-2 h-5 w-5" />
                            Analyze Opportunity
                        </>
                    )}
                </Button>

                {result && (
                    <div className="mt-8 space-y-6 animate-in slide-in-from-top-4 duration-500">
                        <div className="p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10 shadow-inner">
                            <h4 className="font-bold text-sm flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400">
                                <MessageSquare className="h-4 w-4" />
                                STRATEGIC OPPORTUNITY SUMMARY
                            </h4>
                            <p className="text-sm leading-relaxed text-muted-foreground italic">"{result.summary}"</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2">
                                    <TrendingUp className="h-3 w-3" />
                                    Emerging Trends
                                </h4>
                                <div className="space-y-2">
                                    {result.trends.map((t: string, i: number) => (
                                        <div key={i} className="text-sm p-3 bg-muted/30 rounded-lg flex items-center gap-3 border border-transparent hover:border-primary/20 transition-all">
                                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                            {t}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2">
                                    <ShieldAlert className="h-3 w-3" />
                                    Risk Density (Score: {result.riskScore}/100)
                                </h4>
                                <div className="space-y-4">
                                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-muted-foreground/10">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                                            style={{ width: `${result.riskScore}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[9px] font-black text-muted-foreground px-1 uppercase letter tracking-tighter">
                                        <span>Blue Ocean</span>
                                        <span>Highly Competitive</span>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <h5 className="text-[10px] font-black uppercase text-muted-foreground mb-2">Key Competitors</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {result.competitors.map((c: string, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-secondary rounded text-[10px] font-bold border border-secondary-foreground/10">{c}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
