"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { suggestTalent } from '@/ai/flows/talent-suggestions';
import { Loader2, Users, Target, UserPlus, Info } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function TalentSuggestionTool() {
    const [description, setDescription] = useState('');
    const [skills, setSkills] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleSuggest = async () => {
        if (!description || !skills) return;
        setLoading(true);
        try {
            const res = await suggestTalent({
                startupDescription: description,
                requiredSkills: skills,
                equityExpectations: 'Vesting/Equity'
            });
            setSuggestions(res.talentSuggestions);
        } catch (e) {
            console.error('Talent suggestion error:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="glass shadow-2xl overflow-hidden rounded-2xl border-none">
            <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-8">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                        <Users className="text-emerald-600 h-6 w-6" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-black tracking-tight">AI Co-founder Finder</CardTitle>
                        <CardDescription>Precision matching tool to find the perfect technical or operational backbone for your venture.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                            <Info className="h-3 w-3" />
                            Startup Context
                        </label>
                        <Textarea
                            placeholder="Describe your startup, vision and current stage..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="bg-background/50 min-h-[120px] rounded-xl border-muted-foreground/10"
                        />
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                            <Target className="h-3 w-3" />
                            Target Skills
                        </label>
                        <Input
                            placeholder="e.g. Solidity, Next.js, Product Design, Sales"
                            value={skills}
                            onChange={e => setSkills(e.target.value)}
                            className="bg-background/50 h-12 rounded-xl"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleSuggest}
                    disabled={loading || !description || !skills}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 text-md font-black shadow-lg shadow-emerald-500/20 rounded-xl transition-all hover:scale-[1.01]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin mr-3 h-5 w-5" />
                            Scanning Marketplace...
                        </>
                    ) : (
                        <>
                            <UserPlus className="mr-3 h-5 w-5" />
                            Find Matches
                        </>
                    )}
                </Button>

                {suggestions.length > 0 && (
                    <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.3em] text-center">Top AI-vetted Matches</h4>
                        <div className="grid gap-4">
                            {suggestions.map((s, i) => (
                                <Card key={i} className="p-4 bg-emerald-500/5 border-emerald-500/10 hover:bg-emerald-500/10 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-emerald-500/20">
                                            <AvatarFallback className="bg-emerald-500/10 text-emerald-700 font-bold">
                                                {s.split(' ')[0][0]}{s.split(' ')[1]?.[0] || 'X'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="font-bold text-sm text-foreground mb-1">{s.split(' - ')[0]}</h5>
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                {s.split(' - ')[1] || "High-potential talent matching your startup needs and equity preferences."}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-emerald-600 font-bold text-[10px] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Profile
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
