'use client';

import React, { useState, useEffect } from 'react';
import { Crown, TrendingUp, AlertCircle, Settings, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import subscriptionService, { Subscription, Usage } from '@/services/subscription.service';
import Link from 'next/link';

export default function SubscriptionPage() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [usage, setUsage] = useState<Usage | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [sub, use] = await Promise.all([
                subscriptionService.getCurrentSubscription(),
                subscriptionService.getUsage()
            ]);
            setSubscription(sub);
            setUsage(use);
        } catch (error) {
            console.error('Failed to load subscription data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleManageSubscription = async () => {
        try {
            const { url } = await subscriptionService.createPortalSession();
            window.location.href = url;
        } catch (error) {
            console.error('Failed to open portal:', error);
        }
    };

    const handleCancelSubscription = async () => {
        if (!confirm('Are you sure you want to cancel your subscription?')) return;

        try {
            await subscriptionService.cancelSubscription(false);
            loadData();
        } catch (error) {
            console.error('Failed to cancel subscription:', error);
        }
    };

    const currentPlan = subscription ? subscriptionService.getPlanById(subscription.planId) : null;

    const getUsagePercentage = (used: number, limit: number) => {
        if (limit === -1) return 0; // unlimited
        return (used / limit) * 100;
    };

    const getUsageColor = (percentage: number) => {
        if (percentage >= 90) return 'text-red-600';
        if (percentage >= 70) return 'text-yellow-600';
        return 'text-green-600';
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <div className="animate-pulse space-y-4">
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Crown className="w-8 h-8 text-primary" />
                    Subscription
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage your plan and usage
                </p>
            </div>

            {/* Current Plan */}
            <Card className="p-6 mb-6 bg-gradient-to-br from-primary/10 to-accent/10">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">{currentPlan?.name || 'Free'} Plan</h2>
                        <p className="text-gray-600 dark:text-gray-400">{currentPlan?.description}</p>
                    </div>
                    <Badge variant={subscription?.status === 'active' ? 'default' : 'glass'} className="text-lg px-4 py-2">
                        {subscription?.status || 'Free'}
                    </Badge>
                </div>

                {subscription && (
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Current period:</span>
                            <span className="font-medium">
                                {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                            </span>
                        </div>
                        {subscription.cancelAtPeriodEnd && (
                            <div className="flex items-center gap-2 text-yellow-600">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm">Subscription will cancel at period end</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex gap-2">
                    {currentPlan?.id !== 'enterprise' && (
                        <Link href="/pricing">
                            <Button className="gradient-primary">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Upgrade Plan
                            </Button>
                        </Link>
                    )}
                    {subscription && (
                        <Button variant="outline" onClick={handleManageSubscription}>
                            <Settings className="w-4 h-4 mr-2" />
                            Manage Subscription
                        </Button>
                    )}
                    {subscription && !subscription.cancelAtPeriodEnd && (
                        <Button variant="outline" onClick={handleCancelSubscription}>
                            Cancel Plan
                        </Button>
                    )}
                </div>
            </Card>

            {/* Usage */}
            {usage && currentPlan && (
                <Card className="p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4">Usage This Month</h3>
                    <div className="space-y-4">
                        {/* AI Credits */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">AI Credits</span>
                                <span className={getUsageColor(getUsagePercentage(usage.aiCredits, currentPlan.limits.aiCredits))}>
                                    {usage.aiCredits} / {subscriptionService.isUnlimited(currentPlan.limits.aiCredits) ? '∞' : currentPlan.limits.aiCredits}
                                </span>
                            </div>
                            {!subscriptionService.isUnlimited(currentPlan.limits.aiCredits) && (
                                <Progress value={getUsagePercentage(usage.aiCredits, currentPlan.limits.aiCredits)} className="h-2" />
                            )}
                        </div>

                        {/* Pitch Decks */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Pitch Decks</span>
                                <span className={getUsageColor(getUsagePercentage(usage.pitchDecks, currentPlan.limits.pitchDecks))}>
                                    {usage.pitchDecks} / {subscriptionService.isUnlimited(currentPlan.limits.pitchDecks) ? '∞' : currentPlan.limits.pitchDecks}
                                </span>
                            </div>
                            {!subscriptionService.isUnlimited(currentPlan.limits.pitchDecks) && (
                                <Progress value={getUsagePercentage(usage.pitchDecks, currentPlan.limits.pitchDecks)} className="h-2" />
                            )}
                        </div>

                        {/* MVP Plans */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">MVP Plans</span>
                                <span className={getUsageColor(getUsagePercentage(usage.mvpPlans, currentPlan.limits.mvpPlans))}>
                                    {usage.mvpPlans} / {subscriptionService.isUnlimited(currentPlan.limits.mvpPlans) ? '∞' : currentPlan.limits.mvpPlans}
                                </span>
                            </div>
                            {!subscriptionService.isUnlimited(currentPlan.limits.mvpPlans) && (
                                <Progress value={getUsagePercentage(usage.mvpPlans, currentPlan.limits.mvpPlans)} className="h-2" />
                            )}
                        </div>

                        {/* Contracts */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Contracts</span>
                                <span className={getUsageColor(getUsagePercentage(usage.contracts, currentPlan.limits.contracts))}>
                                    {usage.contracts} / {subscriptionService.isUnlimited(currentPlan.limits.contracts) ? '∞' : currentPlan.limits.contracts}
                                </span>
                            </div>
                            {!subscriptionService.isUnlimited(currentPlan.limits.contracts) && (
                                <Progress value={getUsagePercentage(usage.contracts, currentPlan.limits.contracts)} className="h-2" />
                            )}
                        </div>

                        {/* Storage */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Storage</span>
                                <span className={getUsageColor(getUsagePercentage(usage.storage, currentPlan.limits.storage))}>
                                    {usage.storage.toFixed(2)}GB / {subscriptionService.isUnlimited(currentPlan.limits.storage) ? '∞' : `${currentPlan.limits.storage}GB`}
                                </span>
                            </div>
                            {!subscriptionService.isUnlimited(currentPlan.limits.storage) && (
                                <Progress value={getUsagePercentage(usage.storage, currentPlan.limits.storage)} className="h-2" />
                            )}
                        </div>
                    </div>
                </Card>
            )}

            {/* Billing History */}
            {subscription && (
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Billing History</h3>
                        <Button variant="outline" size="sm" onClick={handleManageSubscription}>
                            <CreditCard className="w-4 h-4 mr-2" />
                            View All Invoices
                        </Button>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Access your complete billing history and download invoices through the billing portal.
                    </p>
                </Card>
            )}
        </div>
    );
}
