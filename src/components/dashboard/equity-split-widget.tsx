"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PieChart, ScrollText } from "lucide-react";

interface EquityData {
    totalAllocated: number; // Percentage
    founders: { user: string; role: string; percentage: number; status: 'proposed' | 'agreed' | 'signed' }[];
    poolRemaining: number;
}

export function EquitySplitWidget({ data }: { data: EquityData }) {
    if (!data) return null;

    return (
        <Card className="h-full border-muted/40 relative overflow-hidden">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <ScrollText className="h-5 w-5 text-blue-500" />
                        Equity Cap Table
                    </CardTitle>
                    <Badge variant="secondary" className="font-mono">
                        ESOP Pool: {data.poolRemaining}%
                    </Badge>
                </div>
                <CardDescription>Soft-contracts & vesting simulation.</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {/* Visual Bar */}
                    <div className="h-4 w-full bg-secondary rounded-full overflow-hidden flex relative">
                        {data.founders.map((f, i) => (
                            <div
                                key={f.user}
                                style={{ width: `${f.percentage}%` }}
                                className={`h-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-blue-500' : 'bg-orange-500'}`}
                            />
                        ))}
                        <div className="h-full bg-muted/30 absolute right-0 top-0 flex items-center justify-center text-[8px] font-bold text-muted-foreground" style={{ width: `${data.poolRemaining}%` }}>
                            POOL
                        </div>
                    </div>

                    {/* List */}
                    <div className="space-y-2">
                        {data.founders.map((f, i) => (
                            <div key={f.user} className="flex items-center justify-between p-2 rounded-lg border bg-card/50">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-blue-500' : 'bg-orange-500'}`} />
                                    <div>
                                        <div className="font-bold text-sm">{f.user}</div>
                                        <div className="text-xs text-muted-foreground">{f.role}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-bold">{f.percentage}%</div>
                                    <Badge variant="outline" className={`text-[10px] h-4 px-1 uppercase ${f.status === 'signed' ? 'text-green-500 border-green-500/30' : 'text-yellow-500 border-yellow-500/30'}`}>
                                        {f.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button variant="outline" size="sm" className="w-full text-xs gap-2">
                        <PieChart className="h-3 w-3" /> Simulate Dilution
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
