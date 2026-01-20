'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download, Edit, Loader2, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import aiBuilderService, { PitchDeck, PitchSlide } from '@/services/ai-builder.service';

const slideTypes = [
    { value: 'cover', label: 'Cover', icon: '📄' },
    { value: 'problem', label: 'Problem', icon: '❓' },
    { value: 'solution', label: 'Solution', icon: '💡' },
    { value: 'market', label: 'Market Size', icon: '📊' },
    { value: 'product', label: 'Product', icon: '🎯' },
    { value: 'business_model', label: 'Business Model', icon: '💰' },
    { value: 'traction', label: 'Traction', icon: '📈' },
    { value: 'team', label: 'Team', icon: '👥' },
    { value: 'financials', label: 'Financials', icon: '💵' },
    { value: 'ask', label: 'The Ask', icon: '🚀' }
];

export function PitchDeckBuilder() {
    const [pitchDeck, setPitchDeck] = useState<PitchDeck | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [editingSlide, setEditingSlide] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        problem: '',
        solution: '',
        market: '',
        businessModel: ''
    });

    const handleGenerate = async () => {
        if (!formData.name || !formData.problem || !formData.solution) return;

        setIsGenerating(true);
        try {
            const deck = await aiBuilderService.generatePitchDeck(formData);
            setPitchDeck(deck);
        } catch (error) {
            console.error('Failed to generate pitch deck:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUpdateSlide = async (slideId: string, content: Partial<PitchSlide>) => {
        if (!pitchDeck) return;

        try {
            const updated = await aiBuilderService.updatePitchSlide(pitchDeck.id, slideId, content);
            setPitchDeck(updated);
            setEditingSlide(null);
        } catch (error) {
            console.error('Failed to update slide:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Generation Form */}
            {!pitchDeck && (
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="w-6 h-6 text-primary" />
                        <div>
                            <h3 className="text-lg font-semibold">Generate Pitch Deck</h3>
                            <p className="text-sm text-gray-600">AI will create a professional pitch deck for you</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Startup Name *</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter your startup name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Problem Statement *</label>
                            <textarea
                                value={formData.problem}
                                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                                placeholder="What problem are you solving?"
                                className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Your Solution *</label>
                            <textarea
                                value={formData.solution}
                                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                                placeholder="How does your product solve this problem?"
                                className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Target Market (Optional)</label>
                            <Input
                                value={formData.market}
                                onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                                placeholder="Who are your customers?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Business Model (Optional)</label>
                            <Input
                                value={formData.businessModel}
                                onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                                placeholder="How will you make money?"
                            />
                        </div>

                        <Button
                            onClick={handleGenerate}
                            disabled={!formData.name || !formData.problem || !formData.solution || isGenerating}
                            className="w-full gradient-primary"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating Pitch Deck...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Generate Pitch Deck
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            )}

            {/* Pitch Deck Display */}
            {pitchDeck && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold">{pitchDeck.title}</h3>
                            <Badge variant="glass">{pitchDeck.slides.length} slides</Badge>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Export PDF
                            </Button>
                            <Button variant="outline" onClick={() => setPitchDeck(null)}>
                                New Deck
                            </Button>
                        </div>
                    </div>

                    {/* Slides */}
                    <div className="grid grid-cols-1 gap-4">
                        {pitchDeck.slides.sort((a, b) => a.order - b.order).map((slide) => (
                            <Card key={slide.id} className="p-6 hover-lift">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">
                                            {slideTypes.find(t => t.value === slide.type)?.icon || '📄'}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg">{slide.title}</h4>
                                            <Badge variant="glass" className="text-xs mt-1">
                                                Slide {slide.order + 1}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditingSlide(editingSlide === slide.id ? null : slide.id)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                </div>

                                {editingSlide === slide.id ? (
                                    <div className="space-y-3">
                                        <Input
                                            value={slide.title}
                                            onChange={(e) => handleUpdateSlide(slide.id, { title: e.target.value })}
                                            placeholder="Slide title"
                                        />
                                        <textarea
                                            value={slide.content}
                                            onChange={(e) => handleUpdateSlide(slide.id, { content: e.target.value })}
                                            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none"
                                        />
                                        <Button size="sm" onClick={() => setEditingSlide(null)}>
                                            Done
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                            {slide.content}
                                        </p>
                                        {slide.notes && (
                                            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                                    <strong>Speaker Notes:</strong> {slide.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
