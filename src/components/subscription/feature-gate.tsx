'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Crown, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import subscriptionService from '@/services/subscription.service';
import Link from 'next/link';

interface FeatureGateProps {
    feature: 'aiCredits' | 'pitchDecks' | 'mvpPlans' | 'contracts';
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
    const [canUse, setCanUse] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkFeature();
    }, [feature]);

    const checkFeature = async () => {
        try {
            const allowed = await subscriptionService.canUseFeature(feature);
            setCanUse(allowed);
        } catch (error) {
            setCanUse(false);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-32" />;
    }

    if (!canUse) {
        return fallback || <UpgradePrompt feature={feature} />;
    }

    return <>{children}</>;
}

function UpgradePrompt({ feature }: { feature: string }) {
    const featureNames = {
        aiCredits: 'AI Credits',
        pitchDecks: 'Pitch Deck Generation',
        mvpPlans: 'MVP Planning',
        contracts: 'Contract Generation'
    };

    return (
        <Card className="p-8 text-center bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Upgrade to Continue</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
                You've reached your limit for {featureNames[feature as keyof typeof featureNames]}
            </p>
            <Badge variant="glass" className="mb-6">
                Available on Starter plan and above
            </Badge>
            <Link href="/pricing">
                <Button className="gradient-primary">
                    <Crown className="w-4 h-4 mr-2" />
                    View Plans
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </Link>
        </Card>
    );
}

export function PremiumBadge() {
    return (
        <Badge variant="glass" className="bg-gradient-to-r from-primary to-accent text-white">
            <Crown className="w-3 h-3 mr-1" />
            Premium
        </Badge>
    );
}

export function useSubscription() {
    const [subscription, setSubscription] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSubscription();
    }, []);

    const loadSubscription = async () => {
        try {
            const sub = await subscriptionService.getCurrentSubscription();
            setSubscription(sub);
        } catch (error) {
            console.error('Failed to load subscription:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isPremium = () => {
        return subscription && subscription.planId !== 'free';
    };

    const canUseFeature = async (feature: string) => {
        return await subscriptionService.canUseFeature(feature as any);
    };

    return {
        subscription,
        isLoading,
        isPremium,
        canUseFeature,
        reload: loadSubscription
    };
}
