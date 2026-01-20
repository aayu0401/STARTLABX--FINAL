'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, MessageSquare, FileText, Lightbulb, History } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CopilotChat } from '@/components/ai-copilot/copilot-chat';
import { SuggestionsList } from '@/components/ai-copilot/suggestion-card';
import { DocumentAnalyzer } from '@/components/ai-copilot/document-analyzer';
import aiCopilotService, { Conversation } from '@/services/ai-copilot.service';
import { formatDate } from '@/lib/utils';

export default function AICopilotPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<string | undefined>();
    const [activeTab, setActiveTab] = useState('chat');
    const [isLoading, setIsLoading] = useState(true);

    // TODO: Get user type from auth context
    const userType: 'startup' | 'professional' = 'startup';

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            const response = await aiCopilotService.getConversations({ limit: 10 });
            setConversations(response.conversations);
        } catch (error) {
            console.error('Failed to load conversations:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
                            AI Copilot
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Your intelligent assistant for startup success
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Sidebar - Conversation History */}
                <div className="lg:col-span-1">
                    <Card className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <History className="w-4 h-4" />
                                Recent Conversations
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSelectedConversation(undefined);
                                    setActiveTab('chat');
                                }}
                            >
                                New Chat
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {isLoading ? (
                                <div className="space-y-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                                    ))}
                                </div>
                            ) : conversations.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    No conversations yet. Start chatting!
                                </p>
                            ) : (
                                conversations.map(conv => (
                                    <button
                                        key={conv.id}
                                        onClick={() => {
                                            setSelectedConversation(conv.id);
                                            setActiveTab('chat');
                                        }}
                                        className={`w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${selectedConversation === conv.id ? 'bg-primary/10' : ''
                                            }`}
                                    >
                                        <h4 className="font-medium text-sm mb-1 truncate">
                                            {conv.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 truncate">
                                            {conv.lastMessage}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatDate(new Date(conv.lastMessageAt))}
                                        </p>
                                    </button>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="chat" className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Chat
                            </TabsTrigger>
                            <TabsTrigger value="suggestions" className="flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" />
                                Suggestions
                            </TabsTrigger>
                            <TabsTrigger value="analyze" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Analyze
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="chat" className="h-[calc(100vh-280px)]">
                            <CopilotChat
                                conversationId={selectedConversation}
                                userType={userType}
                            />
                        </TabsContent>

                        <TabsContent value="suggestions">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">AI Suggestions</h3>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={loadConversations}
                                    >
                                        Refresh
                                    </Button>
                                </div>
                                <SuggestionsList />
                            </div>
                        </TabsContent>

                        <TabsContent value="analyze">
                            <DocumentAnalyzer />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
