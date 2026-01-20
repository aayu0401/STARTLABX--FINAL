'use client';

import React, { useState } from 'react';
import { Rocket, Clock, DollarSign, Code, CheckCircle2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import aiBuilderService, { MVPPlan, MVPFeature } from '@/services/ai-builder.service';

export function MVPPlanner() {
    const [mvpPlan, setMvpPlan] = useState<MVPPlan | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState({
        productIdea: '',
        targetUsers: '',
        keyFeatures: [''],
        timeline: 12,
        budget: 0
    });

    const handleAddFeature = () => {
        setFormData({
            ...formData,
            keyFeatures: [...formData.keyFeatures, '']
        });
    };

    const handleRemoveFeature = (index: number) => {
        setFormData({
            ...formData,
            keyFeatures: formData.keyFeatures.filter((_, i) => i !== index)
        });
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.keyFeatures];
        newFeatures[index] = value;
        setFormData({ ...formData, keyFeatures: newFeatures });
    };

    const handleGenerate = async () => {
        if (!formData.productIdea || !formData.targetUsers) return;

        setIsGenerating(true);
        try {
            const plan = await aiBuilderService.generateMVPPlan({
                productIdea: formData.productIdea,
                targetUsers: formData.targetUsers,
                keyFeatures: formData.keyFeatures.filter(f => f.trim()),
                timeline: formData.timeline,
                budget: formData.budget || undefined
            });
            setMvpPlan(plan);
        } catch (error) {
            console.error('Failed to generate MVP plan:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUpdateFeatureStatus = async (featureId: string, status: string) => {
        if (!mvpPlan) return;

        try {
            const updated = await aiBuilderService.updateMVPFeature(mvpPlan.id, featureId, status);
            setMvpPlan(updated);
        } catch (error) {
            console.error('Failed to update feature:', error);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'must_have': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
            case 'should_have': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
            case 'nice_to_have': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const calculateProgress = () => {
        if (!mvpPlan) return 0;
        const completed = mvpPlan.features.filter(f => f.status === 'completed').length;
        return (completed / mvpPlan.features.length) * 100;
    };

    return (
        <div className="space-y-6">
            {/* Generation Form */}
            {!mvpPlan && (
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Rocket className="w-6 h-6 text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold">Generate MVP Plan</h3>
                            <p className="text-sm text-gray-600">AI will create a detailed MVP roadmap</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Product Idea *</label>
                            <textarea
                                value={formData.productIdea}
                                onChange={(e) => setFormData({ ...formData, productIdea: e.target.value })}
                                placeholder="Describe your product idea..."
                                className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Target Users *</label>
                            <Input
                                value={formData.targetUsers}
                                onChange={(e) => setFormData({ ...formData, targetUsers: e.target.value })}
                                placeholder="Who will use this product?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Key Features</label>
                            {formData.keyFeatures.map((feature, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <Input
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        placeholder={`Feature ${index + 1}`}
                                    />
                                    {formData.keyFeatures.length > 1 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRemoveFeature(index)}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={handleAddFeature}>
                                + Add Feature
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Timeline (weeks)</label>
                                <Input
                                    type="number"
                                    value={formData.timeline}
                                    onChange={(e) => setFormData({ ...formData, timeline: parseInt(e.target.value) })}
                                    min={4}
                                    max={52}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Budget (USD, optional)</label>
                                <Input
                                    type="number"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={!formData.productIdea || !formData.targetUsers || isGenerating}
                            className="w-full gradient-primary"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating MVP Plan...
                                </>
                            ) : (
                                <>
                                    <Rocket className="w-4 h-4 mr-2" />
                                    Generate MVP Plan
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            )}

            {/* MVP Plan Display */}
            {mvpPlan && (
                <div className="space-y-6">
                    {/* Header */}
                    <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">{mvpPlan.name}</h3>
                                <p className="text-gray-700 dark:text-gray-300">{mvpPlan.description}</p>
                            </div>
                            <Button variant="outline" onClick={() => setMvpPlan(null)}>
                                New Plan
                            </Button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-primary" />
                                <div>
                                    <div className="text-sm text-gray-600">Timeline</div>
                                    <div className="font-semibold">{mvpPlan.timeline.totalWeeks} weeks</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Code className="w-5 h-5 text-accent" />
                                <div>
                                    <div className="text-sm text-gray-600">Features</div>
                                    <div className="font-semibold">{mvpPlan.features.length} features</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <DollarSign className="w-5 h-5 text-green-500" />
                                <div>
                                    <div className="text-sm text-gray-600">Budget</div>
                                    <div className="font-semibold">
                                        {mvpPlan.resources.budget ? `$${mvpPlan.resources.budget.toLocaleString()}` : 'Not set'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Overall Progress</span>
                                <span className="text-sm font-bold">{Math.round(calculateProgress())}%</span>
                            </div>
                            <Progress value={calculateProgress()} className="h-3" />
                        </div>
                    </Card>

                    {/* Tech Stack */}
                    <Card className="p-6">
                        <h4 className="font-semibold mb-3">Recommended Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                            {mvpPlan.techStack.map((tech, index) => (
                                <Badge key={index} variant="glass">{tech}</Badge>
                            ))}
                        </div>
                    </Card>

                    {/* Features */}
                    <Card className="p-6">
                        <h4 className="font-semibold mb-4">Features Breakdown</h4>
                        <div className="space-y-3">
                            {mvpPlan.features.map((feature) => (
                                <div
                                    key={feature.id}
                                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary transition-colors"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h5 className="font-medium">{feature.name}</h5>
                                                <Badge className={getPriorityColor(feature.priority)}>
                                                    {feature.priority.replace('_', ' ')}
                                                </Badge>
                                                {feature.status === 'completed' && (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {feature.description}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Estimated: {feature.estimatedHours} hours
                                            </p>
                                        </div>

                                        <select
                                            value={feature.status}
                                            onChange={(e) => handleUpdateFeatureStatus(feature.id, e.target.value)}
                                            className="ml-4 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Timeline Phases */}
                    <Card className="p-6">
                        <h4 className="font-semibold mb-4">Development Phases</h4>
                        <div className="space-y-4">
                            {mvpPlan.timeline.phases.map((phase, index) => (
                                <div key={index} className="border-l-4 border-primary pl-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="gradient">{index + 1}</Badge>
                                        <h5 className="font-medium">{phase.name}</h5>
                                        <span className="text-sm text-gray-500">({phase.duration} weeks)</span>
                                    </div>
                                    <div className="space-y-1">
                                        {phase.deliverables.map((deliverable, i) => (
                                            <p key={i} className="text-sm text-gray-600 dark:text-gray-400">
                                                • {deliverable}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
