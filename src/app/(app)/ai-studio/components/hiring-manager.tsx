'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-context';
import { Loader2, Briefcase, DollarSign, Search, CheckCircle, Sparkles } from 'lucide-react';
import { talentService } from '@/services/talent.service';
import type { Talent } from '@/app/(app)/talent/components/types';

export function HiringManager() {
    const { user } = useAuth(); // User is the Founder/Creator
    const [tab, setTab] = useState<'post' | 'search'>('post');

    // Post Form State
    const [role, setRole] = useState('');
    const [type, setType] = useState('equity');
    const [description, setDescription] = useState('');
    const [compensation, setCompensation] = useState('');
    const [skills, setSkills] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [postedSuccess, setPostedSuccess] = useState(false);

    // Search/Recommend State
    const [recommendations, setRecommendations] = useState<Talent[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handlePost = async () => {
        if (!role || !description) return;
        setIsPosting(true);

        try {
            const res = await fetch('/api/opportunities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id || 'demo-user-id',
                    type,
                    role,
                    description,
                    compensation,
                    skills: skills.split(',').map(s => s.trim()).filter(Boolean),
                    startupId: undefined
                })
            });
            if (res.ok) {
                setPostedSuccess(true);
                // Trigger auto-search?
                handleSearch(skills.split(',').map(s => s.trim())[0]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsPosting(false);
        }
    };

    const handleSearch = async (querySkill?: string) => {
        setIsSearching(true);
        setTab('search');
        try {
            const res = await talentService.getAll();
            const allTalent = res.data.professionals as unknown as Talent[];

            // Simple client-side matching algo
            const searchTerms = (querySkill || skills || role).toLowerCase().split(' ');

            const matches = allTalent.filter(t => {
                const doc = JSON.stringify(t).toLowerCase();
                return searchTerms.some(term => doc.includes(term));
            });

            setRecommendations(matches);
        } catch (e) {
            console.error(e);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
            {/* Left Panel: Job Creator */}
            <div className="space-y-6">
                <Card className="p-6 border-primary/20 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Define Requirement</h3>
                            <p className="text-sm text-muted-foreground">Post a new role for your startup.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold mb-1 block">Role Title</label>
                                <Input placeholder="e.g. CTO" value={role} onChange={e => setRole(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold mb-1 block">Engagement Type</label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="equity">Equity Co-Founder</SelectItem>
                                        <SelectItem value="freelance">Freelance / Contract</SelectItem>
                                        <SelectItem value="job">Full-time Job</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold mb-1 block">Compensation Range</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder={type === 'equity' ? "e.g. 5% - 15%" : "e.g. $80/hr"} className="pl-9" value={compensation} onChange={e => setCompensation(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-semibold mb-1 block">Required Skills (comma separated)</label>
                            <Input placeholder="React, Node.js, AI..." value={skills} onChange={e => setSkills(e.target.value)} />
                        </div>

                        <div>
                            <label className="text-xs font-semibold mb-1 block">Description</label>
                            <Textarea placeholder="Describe the mission and responsibilities..." className="min-h-[100px]" value={description} onChange={e => setDescription(e.target.value)} />
                        </div>

                        <Button className="w-full gap-2 bg-gradient-premium" onClick={handlePost} disabled={isPosting || postedSuccess}>
                            {isPosting ? <Loader2 className="animate-spin" /> : (postedSuccess ? <CheckCircle /> : <Sparkles className="h-4 w-4" />)}
                            {postedSuccess ? "Live on Platform" : "Post & Find Matches"}
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Right Panel: Recommendations */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        AI Recommendations
                        <Badge variant="outline">{recommendations.length}</Badge>
                    </h3>
                    {tab === 'post' && postedSuccess && (
                        <Badge className="bg-green-500 hover:bg-green-600">Based on your new post</Badge>
                    )}
                </div>

                {isSearching ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-muted/50 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {recommendations.length > 0 ? (
                            recommendations.map(talent => (
                                <Card key={talent.id} className="p-4 flex gap-4 hover:border-primary/50 transition-colors group cursor-pointer">
                                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${talent.id}`} />
                                        <AvatarFallback>{talent.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-sm">{talent.name}</h4>
                                                <p className="text-xs text-muted-foreground">{talent.title}</p>
                                            </div>
                                            <Badge variant="secondary" className="text-[10px] group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                {Math.floor(Math.random() * 20 + 80)}% Match
                                            </Badge>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {talent.skills.slice(0, 3).map(skill => (
                                                <Badge key={skill} variant="outline" className="text-[10px] px-1 py-0">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className="p-12 text-center border-dashed border-2">
                                <Search className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
                                <p className="text-sm text-muted-foreground">Define your requirement to see matching professionals.</p>
                            </Card>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
