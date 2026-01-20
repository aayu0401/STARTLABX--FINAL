'use client';

import React, { useState } from 'react';
import { Sparkles, Lightbulb, TrendingUp, Target, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import aiBuilderService, { IdeaValidation } from '@/services/ai-builder.service';

export function IdeaValidator() {
    const [idea, setIdea] = useState('');
    const [industry, setIndustry] = useState('');
    const [validation, setValidation] = useState<IdeaValidation | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    const handleValidate = async () => {
        if (!idea.trim()) return;

        setIsValidating(true);
        setValidation(null);

        try {
            const result = await aiBuilderService.validateIdea(idea, industry);
            setValidation(result);
        } catch (error) {
            console.error('Failed to validate idea:', error);
        } finally {
            setIsValidating(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Needs Work';
    };

    return (
        <div className="space-y-6">
            {/* Input Section */}
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Validate Your Startup Idea</h3>
                        <p className="text-sm text-gray-600">Get AI-powered insights and recommendations</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Your Startup Idea</label>
                        <textarea
                            value={idea}
                            onChange={(e) => setIdea(e.target.value)}
                            placeholder="Describe your startup idea in detail..."
                            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-primary"
                            disabled={isValidating}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Industry (Optional)</label>
                        <Input
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            placeholder="e.g., FinTech, HealthTech, EdTech"
                            disabled={isValidating}
                        />
                    </div>

                    <Button
                        onClick={handleValidate}
                        disabled={!idea.trim() || isValidating}
                        className="w-full gradient-primary"
                    >
                        {isValidating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Analyzing Your Idea...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Validate Idea
                            </>
                        )}
                    </Button>
                </div>
            </Card>

            {/* Validation Results */}
            {validation && (
                <div className="space-y-4">
                    {/* Overall Score */}
                    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                        <div className="text-center mb-6">
                            <div className={`text-6xl font-bold mb-2 ${getScoreColor(validation.analysis.overallScore)}`}>
                                {validation.analysis.overallScore}
                            </div>
                            <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                {getScoreLabel(validation.analysis.overallScore)}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Market Potential</span>
                                    <span className="text-sm font-bold">{validation.analysis.marketPotential}%</span>
                                </div>
                                <Progress value={validation.analysis.marketPotential} className="h-2" />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Feasibility</span>
                                    <span className="text-sm font-bold">{validation.analysis.feasibility}%</span>
                                </div>
                                <Progress value={validation.analysis.feasibility} className="h-2" />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Uniqueness</span>
                                    <span className="text-sm font-bold">{validation.analysis.uniqueness}%</span>
                                </div>
                                <Progress value={validation.analysis.uniqueness} className="h-2" />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Competition</span>
                                    <span className="text-sm font-bold">{100 - validation.analysis.competitionLevel}%</span>
                                </div>
                                <Progress value={100 - validation.analysis.competitionLevel} className="h-2" />
                            </div>
                        </div>
                    </Card>

                    {/* Insights */}
                    <Card className="p-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-primary" />
                            Key Insights
                        </h4>
                        <ul className="space-y-2">
                            {validation.insights.map((insight, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{insight}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Recommendations */}
                    <Card className="p-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Target className="w-5 h-5 text-accent" />
                            Recommendations
                        </h4>
                        <ul className="space-y-2">
                            {validation.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <TrendingUp className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Risks & Opportunities */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                Potential Risks
                            </h4>
                            <ul className="space-y-2">
                                {validation.risks.map((risk, index) => (
                                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                                        • {risk}
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <Card className="p-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-500" />
                                Opportunities
                            </h4>
                            <ul className="space-y-2">
                                {validation.opportunities.map((opp, index) => (
                                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                                        • {opp}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>

                    {/* Next Steps */}
                    <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10">
                        <h4 className="font-semibold mb-3">🚀 Next Steps</h4>
                        <div className="space-y-2">
                            {validation.nextSteps.map((step, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <Badge variant="gradient" className="w-6 h-6 rounded-full flex items-center justify-center">
                                        {index + 1}
                                    </Badge>
                                    <span className="text-sm font-medium">{step}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
