'use client';

import React, { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import aiCopilotService from '@/services/ai-copilot.service';

const analysisTypes = [
    { value: 'contract', label: 'Contract', icon: FileText },
    { value: 'pitch_deck', label: 'Pitch Deck', icon: FileText },
    { value: 'business_plan', label: 'Business Plan', icon: FileText },
    { value: 'general', label: 'General Document', icon: FileText }
] as const;

export function DocumentAnalyzer() {
    const [selectedType, setSelectedType] = useState<'contract' | 'pitch_deck' | 'business_plan' | 'general'>('general');
    const [documentText, setDocumentText] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        if (!documentText.trim()) return;

        setIsAnalyzing(true);
        setAnalysis('');

        try {
            const response = await aiCopilotService.analyzeDocument({
                documentText,
                analysisType: selectedType
            });

            setAnalysis(response.analysis);
        } catch (error) {
            console.error('Failed to analyze document:', error);
            setAnalysis('Failed to analyze document. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-4">
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Document Analysis
                </h3>

                {/* Analysis Type Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Document Type</label>
                    <div className="grid grid-cols-2 gap-2">
                        {analysisTypes.map(type => (
                            <Button
                                key={type.value}
                                variant={selectedType === type.value ? 'gradient' : 'outline'}
                                onClick={() => setSelectedType(type.value)}
                                className="justify-start"
                            >
                                <type.icon className="w-4 h-4 mr-2" />
                                {type.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Document Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Paste Document Text
                    </label>
                    <textarea
                        value={documentText}
                        onChange={(e) => setDocumentText(e.target.value)}
                        placeholder="Paste your document text here..."
                        className="w-full h-48 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        disabled={isAnalyzing}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {documentText.length} characters
                    </p>
                </div>

                {/* Analyze Button */}
                <Button
                    onClick={handleAnalyze}
                    disabled={!documentText.trim() || isAnalyzing}
                    className="w-full gradient-primary"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Analyze Document
                        </>
                    )}
                </Button>
            </Card>

            {/* Analysis Results */}
            {analysis && (
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Analysis Results
                    </h4>
                    <div className="prose dark:prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                            {analysis}
                        </pre>
                    </div>
                </Card>
            )}
        </div>
    );
}
