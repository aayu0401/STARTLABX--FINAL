"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle2, DollarSign, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvestorDeal {
    id: string;
    startupName: string;
    industry: string;
    tractionScore: number;
    matchScore: number;
    fundingAsk: string;
    logo?: string;
}

export function InvestorDealFlow({ deals }: { deals: InvestorDeal[] }) {
    if (!deals || deals.length === 0) return null;

    return (
        <Card className="h-full border-muted/40 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -z-10" />

            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        Qualified Deal Flow
                    </CardTitle>
                    <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10 uppercase tracking-wider font-bold">
                        Top 1% Traction
                    </Badge>
                </div>
                <CardDescription>AI-curated startups matching your thesis & traction requirements.</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-3">
                    {deals.map((deal) => (
                        <div key={deal.id} className="group relative flex items-center justify-between p-3 rounded-lg border border-muted/40 bg-card hover:bg-secondary/50 hover:border-primary/20 transition-all cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-xl shadow-sm border border-muted">
                                    {deal.logo || '🚀'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-sm">{deal.startupName}</h4>
                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{deal.industry}</Badge>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3 text-green-500" />
                                            TS: <span className="font-mono font-bold text-foreground">{deal.tractionScore}</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3 text-blue-500" />
                                            Fit: <span className="font-mono font-bold text-foreground">{deal.matchScore}%</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-sm font-bold text-green-500">{deal.fundingAsk}</div>
                                <Button size="sm" variant="ghost" className="h-6 text-[10px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity -mr-2">
                                    Deck <ArrowUpRight className="h-3 w-3 ml-1" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <Button variant="outline" className="w-full mt-4 text-xs font-bold uppercase tracking-widest gap-2">
                    View All 42 Qualified Deals
                </Button>
            </CardContent>
        </Card>
    );
}
