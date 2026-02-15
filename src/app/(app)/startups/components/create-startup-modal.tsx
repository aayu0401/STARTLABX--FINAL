'use client';

import React, { useState } from 'react';
import { Rocket, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface CreateStartupModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function CreateStartupModal({ open, onOpenChange, onSuccess }: CreateStartupModalProps) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        mission: '',
        description: '',
        website: '',
        stage: 'Seed',
        location: '',
        logo: ''
    });
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/startups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                toast({
                    title: 'Rocket Launched!',
                    description: 'Your startup is now listed.',
                });
                onSuccess();
                onOpenChange(false);
                setForm({
                    name: '',
                    mission: '',
                    description: '',
                    website: '',
                    stage: 'Seed',
                    location: '',
                    logo: ''
                });
            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to list startup.',
                    variant: 'destructive'
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Rocket className="w-5 h-5 text-primary" />
                            List Your Startup
                        </DialogTitle>
                        <DialogDescription>
                            Showcase your venture to investors and talent.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Startup Name</label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Stage</label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                    value={form.stage}
                                    onChange={(e) => setForm({ ...form, stage: e.target.value })}
                                >
                                    <option>Ideation</option>
                                    <option>Pre-Seed</option>
                                    <option>Seed</option>
                                    <option>Series A</option>
                                    <option>Series B+</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">One-liner Mission</label>
                            <Input
                                placeholder="e.g. Revolutionizing the way we work..."
                                value={form.mission}
                                onChange={(e) => setForm({ ...form, mission: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Website</label>
                            <Input
                                type="url"
                                placeholder="https://..."
                                value={form.website}
                                onChange={(e) => setForm({ ...form, website: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Location</label>
                            <Input
                                placeholder="e.g. San Francisco, CA"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="gradient-primary w-full">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            List Startup
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
