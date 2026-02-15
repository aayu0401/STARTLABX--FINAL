'use client';

import React, { useState, useEffect } from 'react';
import { Check, Zap, Crown, Building2, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import subscriptionService, { type SubscriptionPlan, type Subscription } from '@/services/subscription.service';
import { cn } from '@/lib/utils';

export default function PricingPage() {
    const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [subscribingId, setSubscribingId] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [plansRes, subRes] = await Promise.all([
                    subscriptionService.getPlans(),
                    subscriptionService.getSubscription().catch(() => null)
                ]);
                setPlans(plansRes);
                setCurrentSubscription(subRes);
            } catch (error) {
                console.error('Failed to load pricing data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleSubscribe = async (planId: string) => {
        if (planId === 'free' && !currentSubscription) {
            window.location.href = '/dashboard?subscription=free';
            return;
        }

        setSubscribingId(planId);
        try {
            const { url } = await subscriptionService.subscribe(planId);
            window.location.href = url;
        } catch (error) {
            console.error('Failed to create checkout session:', error);
            alert('Failed to start checkout. Please try again.');
        } finally {
            setSubscribingId(null);
        }
    }

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
        return currentSubscription?.plan === planId;
    };

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading best plans for you...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 animate-in fade-in duration-700">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <Badge variant="glass" className="mb-4">
                        <Sparkles className="w-4 h-4 mr-2 text-primary" />
                        Simple, Transparent Pricing
                    </Badge>
                    <h1 className="text-5xl font-bold mb-4">
                        Choose Your <span className="text-gradient-primary">Perfect Plan</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        Elevate your startup journey with AI-powered tools and elite networking.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-3 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                        <button
                            onClick={() => setBillingInterval('month')}
                            className={cn(
                                'px-8 py-2.5 rounded-lg font-medium transition-all text-sm',
                                billingInterval === 'month'
                                    ? 'bg-white dark:bg-gray-700 shadow-md text-primary'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                            )}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingInterval('year')}
                            className={cn(
                                'px-8 py-2.5 rounded-lg font-medium transition-all text-sm flex items-center gap-2',
                                billingInterval === 'year'
                                    ? 'bg-white dark:bg-gray-700 shadow-md text-primary'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                            )}
                        >
                            Yearly
                            <span className="text-[10px] bg-green-500/10 text-green-600 px-1.5 py-0.5 rounded-full font-bold">Save 20%</span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {plans.map((plan) => {
                        const Icon = getPlanIcon(plan.id);
                        const yearlyPrice = plan.price * 12 * 0.8;
                        const displayPrice = billingInterval === 'year' ? yearlyPrice / 12 : plan.price;
                        const isSubscribing = subscribingId === plan.id;

                        return (
                            <Card
                                key={plan.id}
                                className={cn(
                                    'p-8 relative overflow-hidden transition-all duration-500 flex flex-col',
                                    plan.popular ? 'ring-2 ring-primary scale-105 shadow-2xl z-10' : 'hover:scale-[1.02]'
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-primary to-accent text-white text-[10px] font-black px-4 py-1.5 rounded-bl-xl tracking-widest">
                                        MOST POPULAR
                                    </div>
                                )}

                                {/* Plan Header */}
                                <div className="mb-8">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getPlanColor(plan.id)} flex items-center justify-center mb-6 shadow-lg shadow-primary/10`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{plan.description}</p>
                                </div>

                                {/* Price */}
                                <div className="mb-8">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-extrabold tracking-tight">${displayPrice.toFixed(0)}</span>
                                        <span className="text-gray-500 font-medium tracking-wide">/mo</span>
                                    </div>
                                    {billingInterval === 'year' && plan.price > 0 && (
                                        <p className="text-xs text-green-600 font-bold mt-2 flex items-center gap-1">
                                            <Zap className="w-3 h-3" />
                                            Billed annually (${yearlyPrice.toFixed(0)}/yr)
                                        </p>
                                    )}
                                </div>

                                {/* CTA Button */}
                                <Button
                                    onClick={() => handleSubscribe(plan.id)}
                                    disabled={isSubscribing || isCurrentPlan(plan.id)}
                                    className={cn(
                                        'w-full mb-8 h-12 text-md font-bold transition-all hover:translate-y-[-2px]',
                                        plan.popular ? 'bg-gradient-to-r from-primary to-accent hover:shadow-lg' : ''
                                    )}
                                    variant={plan.popular ? 'default' : 'outline'}
                                >
                                    {isSubscribing ? (
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    ) : null}
                                    {isCurrentPlan(plan.id) ? (
                                        'Active Plan'
                                    ) : plan.id === 'free' ? (
                                        'Get Started'
                                    ) : (
                                        <>
                                            Upgrade to {plan.name}
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>

                                {/* Features List */}
                                <div className="space-y-4 flex-grow">
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="mt-1 p-0.5 rounded-full bg-green-500/10">
                                                <Check className="w-3.5 h-3.5 text-green-500" />
                                            </div>
                                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* FAQ section ... */}
                <div className="max-w-3xl mx-auto border-t border-gray-100 dark:border-gray-800 pt-20">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: 'Can I change plans anytime?',
                                a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect at start of next cycle.'
                            },
                            {
                                q: 'What are AI Credits?',
                                a: 'Credits power our AI Pitch Deck builder, Startup Analytics, and Co-founder matching algorithms.'
                            }
                        ].map((faq, index) => (
                            <Card key={index} className="p-8 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                    {faq.q}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 pl-4 border-l-2 border-gray-100 dark:border-gray-700 leading-relaxed">{faq.a}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
