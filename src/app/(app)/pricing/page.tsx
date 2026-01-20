'use client';

import React, { useState, useEffect } from 'react';
import { Check, Zap, Crown, Building2, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import subscriptionService, { SubscriptionPlan, Subscription } from '@/services/subscription.service';
import { cn } from '@/lib/utils';

export default function PricingPage() {
    const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const plans = subscriptionService.getPlans();

    useEffect(() => {
        loadCurrentSubscription();
    }, []);

    const loadCurrentSubscription = async () => {
        const subscription = await subscriptionService.getCurrentSubscription();
        setCurrentSubscription(subscription);
    };

    const handleSubscribe = async (planId: string) => {
        if (planId === 'free') return;

        setIsLoading(true);
        try {
            const { url } = await subscriptionService.createCheckoutSession(planId);
            window.location.href = url;
        } catch (error) {
            console.error('Failed to create checkout session:', error);
            alert('Failed to start checkout. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getPlanIcon = (planId: string) => {
        switch (planId) {
            case 'free': return Zap;
            case 'starter': return Sparkles;
            case 'professional': return Crown;
            case 'enterprise': return Building2;
            default: return Zap;
        }
    };

    const getPlanColor = (planId: string) => {
        switch (planId) {
            case 'free': return 'from-gray-500 to-gray-600';
            case 'starter': return 'from-blue-500 to-blue-600';
            case 'professional': return 'from-purple-500 to-pink-500';
            case 'enterprise': return 'from-orange-500 to-red-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const isCurrentPlan = (planId: string) => {
        return currentSubscription?.planId === planId;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <Badge variant="glass" className="mb-4">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Simple, Transparent Pricing
                    </Badge>
                    <h1 className="text-5xl font-bold mb-4">
                        Choose Your <span className="text-gradient-primary">Perfect Plan</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                        Start free, upgrade as you grow. No hidden fees.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-3 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <button
                            onClick={() => setBillingInterval('month')}
                            className={cn(
                                'px-6 py-2 rounded-lg font-medium transition-all',
                                billingInterval === 'month'
                                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400'
                            )}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingInterval('year')}
                            className={cn(
                                'px-6 py-2 rounded-lg font-medium transition-all',
                                billingInterval === 'year'
                                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400'
                            )}
                        >
                            Yearly
                            <Badge variant="glass" className="ml-2 text-xs">Save 20%</Badge>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {plans.map((plan) => {
                        const Icon = getPlanIcon(plan.id);
                        const yearlyPrice = plan.price * 12 * 0.8; // 20% discount
                        const displayPrice = billingInterval === 'year' ? yearlyPrice / 12 : plan.price;

                        return (
                            <Card
                                key={plan.id}
                                className={cn(
                                    'p-6 relative overflow-hidden transition-all',
                                    plan.popular ? 'ring-2 ring-primary scale-105 shadow-xl' : 'hover-lift'
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                        POPULAR
                                    </div>
                                )}

                                {/* Plan Header */}
                                <div className="mb-6">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getPlanColor(plan.id)} flex items-center justify-center mb-4`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-bold">${displayPrice.toFixed(0)}</span>
                                        <span className="text-gray-600 dark:text-gray-400">/month</span>
                                    </div>
                                    {billingInterval === 'year' && plan.price > 0 && (
                                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                            Save ${(plan.price * 12 * 0.2).toFixed(0)}/year
                                        </p>
                                    )}
                                </div>

                                {/* CTA Button */}
                                <Button
                                    onClick={() => handleSubscribe(plan.id)}
                                    disabled={isLoading || isCurrentPlan(plan.id)}
                                    className={cn(
                                        'w-full mb-6',
                                        plan.popular ? 'gradient-primary' : ''
                                    )}
                                    variant={plan.popular ? 'default' : 'outline'}
                                >
                                    {isCurrentPlan(plan.id) ? (
                                        'Current Plan'
                                    ) : plan.id === 'free' ? (
                                        'Get Started'
                                    ) : (
                                        <>
                                            Upgrade Now
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>

                                {/* Features */}
                                <div className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Feature Comparison */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-8">Compare Plans</h2>
                    <Card className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left p-4 font-semibold">Feature</th>
                                    {plans.map(plan => (
                                        <th key={plan.id} className="text-center p-4 font-semibold">{plan.name}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="p-4">AI Credits/month</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center p-4">
                                            {subscriptionService.isUnlimited(plan.limits.aiCredits) ? '∞' : plan.limits.aiCredits}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="p-4">Pitch Decks</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center p-4">
                                            {subscriptionService.isUnlimited(plan.limits.pitchDecks) ? '∞' : plan.limits.pitchDecks}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="p-4">MVP Plans</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center p-4">
                                            {subscriptionService.isUnlimited(plan.limits.mvpPlans) ? '∞' : plan.limits.mvpPlans}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="p-4">Contracts</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center p-4">
                                            {subscriptionService.isUnlimited(plan.limits.contracts) ? '∞' : plan.limits.contracts}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="p-4">Team Members</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center p-4">
                                            {subscriptionService.isUnlimited(plan.limits.teamMembers) ? '∞' : plan.limits.teamMembers}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="p-4">Storage</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center p-4">
                                            {subscriptionService.isUnlimited(plan.limits.storage) ? '∞' : `${plan.limits.storage}GB`}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="p-4">Priority Support</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center p-4">
                                            {plan.limits.prioritySupport ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : '—'}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="p-4">Custom Branding</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center p-4">
                                            {plan.limits.customBranding ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : '—'}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-4">API Access</td>
                                    {plans.map(plan => (
                                        <td key={plan.id} className="text-center p-4">
                                            {plan.limits.apiAccess ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : '—'}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </Card>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: 'Can I change plans anytime?',
                                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.'
                            },
                            {
                                q: 'What happens when I reach my limits?',
                                a: 'You\'ll be notified when approaching limits. You can upgrade anytime or wait for the next billing cycle.'
                            },
                            {
                                q: 'Is there a free trial?',
                                a: 'The Free plan is available forever. Paid plans come with a 14-day money-back guarantee.'
                            },
                            {
                                q: 'How do AI credits work?',
                                a: 'Each AI interaction (validation, generation, analysis) uses credits. Credits reset monthly.'
                            }
                        ].map((faq, index) => (
                            <Card key={index} className="p-6">
                                <h3 className="font-semibold mb-2">{faq.q}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
