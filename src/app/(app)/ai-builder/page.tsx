'use client';

import React, { useState } from 'react';
import { Sparkles, Lightbulb, FileText, Rocket, FileSignature, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IdeaValidator } from '@/components/ai-builder/idea-validator';
import { PitchDeckBuilder } from '@/components/ai-builder/pitch-deck-builder';
import { MVPPlanner } from '@/components/ai-builder/mvp-planner';
import { ContractGenerator } from '@/components/contracts/contract-generator';
import { ResourceMarketplace } from '@/components/marketplace/resource-marketplace';

export default function AIBuilderPage() {
    const [activeTab, setActiveTab] = useState('validate');

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            AI Builder Studio
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Build your startup from idea to MVP with AI assistance
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="p-4 hover-lift">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">12</div>
                            <div className="text-xs text-gray-600">Ideas Validated</div>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 hover-lift">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">3</div>
                            <div className="text-xs text-gray-600">Pitch Decks</div>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 hover-lift">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <Rocket className="w-5 h-5 text-green-600 dark:text-green-300" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">5</div>
                            <div className="text-xs text-gray-600">MVP Plans</div>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 hover-lift">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                            <FileSignature className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">8</div>
                            <div className="text-xs text-gray-600">Contracts</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5 mb-6">
                    <TabsTrigger value="validate" className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        <span className="hidden sm:inline">Validate Idea</span>
                    </TabsTrigger>
                    <TabsTrigger value="pitch" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="hidden sm:inline">Pitch Deck</span>
                    </TabsTrigger>
                    <TabsTrigger value="mvp" className="flex items-center gap-2">
                        <Rocket className="w-4 h-4" />
                        <span className="hidden sm:inline">MVP Plan</span>
                    </TabsTrigger>
                    <TabsTrigger value="contracts" className="flex items-center gap-2">
                        <FileSignature className="w-4 h-4" />
                        <span className="hidden sm:inline">Contracts</span>
                    </TabsTrigger>
                    <TabsTrigger value="hire" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span className="hidden sm:inline">Find Talent</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="validate">
                    <IdeaValidator />
                </TabsContent>

                <TabsContent value="pitch">
                    <PitchDeckBuilder />
                </TabsContent>

                <TabsContent value="mvp">
                    <MVPPlanner />
                </TabsContent>

                <TabsContent value="contracts">
                    <ContractGenerator />
                </TabsContent>

                <TabsContent value="hire">
                    <ResourceMarketplace />
                </TabsContent>
            </Tabs>
        </div>
    );
}
