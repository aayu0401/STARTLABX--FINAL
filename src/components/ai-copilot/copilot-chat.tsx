'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Avatar } from '../ui/avatar';
import aiCopilotService, { Message } from '@/services/ai-copilot.service';
import { cn } from '@/lib/utils';
import { VoiceMic } from '../ui/voice-mic';

interface CopilotChatProps {
    conversationId?: string;
    userType: 'startup' | 'professional';
    onClose?: () => void;
    isWidget?: boolean;
}

export function CopilotChat({
    conversationId: initialConversationId,
    userType,
    onClose,
    isWidget = false
}: CopilotChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | undefined>(initialConversationId);
    const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load conversation if ID provided
    useEffect(() => {
        if (initialConversationId) {
            loadConversation(initialConversationId);
        } else {
            // Add welcome message
            setMessages([{
                id: 'welcome',
                role: 'assistant',
                content: userType === 'startup'
                    ? "👋 Hi! I'm your AI Copilot. I'm here to help you build and scale your startup. Ask me anything about team building, equity, fundraising, or strategy!"
                    : "👋 Hi! I'm your AI Copilot. I'm here to help you find the perfect equity opportunity and advance your career. Ask me about evaluating startups, negotiating equity, or skill development!",
                timestamp: new Date()
            }]);
        }
    }, [initialConversationId, userType]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadConversation = async (id: string) => {
        try {
            const conversation = await aiCopilotService.getConversation(id);
            setMessages(conversation.messages);
            setConversationId(id);
        } catch (error) {
            console.error('Failed to load conversation:', error);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Math.random().toString(),
            role: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await aiCopilotService.chat({
                conversationId,
                message: input,
                context: {
                    userType,
                    currentPage: window.location.pathname
                }
            });

            const assistantMessage: Message = {
                id: Math.random().toString(),
                role: 'assistant',
                content: response.message,
                timestamp: new Date(),
                metadata: {
                    tokens: response.tokens
                }
            };

            setMessages(prev => [...prev, assistantMessage]);
            setConversationId(response.conversationId);
        } catch (error) {
            console.error('Failed to send message:', error);

            const errorMessage: Message = {
                id: Math.random().toString(),
                role: 'assistant',
                content: "I'm sorry, I encountered an error. Please try again.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (isWidget && isMinimized) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <Button
                    onClick={() => setIsMinimized(false)}
                    className="rounded-full w-14 h-14 shadow-lg gradient-primary"
                >
                    <Sparkles className="w-6 h-6" />
                </Button>
            </div>
        );
    }

    return (
        <Card className={cn(
            "flex flex-col bg-white dark:bg-gray-900",
            isWidget
                ? "fixed bottom-4 right-4 w-96 h-[600px] shadow-2xl z-50"
                : "w-full h-full"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">AI Copilot</h3>
                        <p className="text-xs text-gray-500">Your personal assistant</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isWidget && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMinimized(true)}
                        >
                            <Minimize2 className="w-4 h-4" />
                        </Button>
                    )}
                    {onClose && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex gap-3",
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                    >
                        {message.role === 'assistant' && (
                            <Avatar className="w-8 h-8 bg-gradient-to-br from-primary to-accent">
                                <Sparkles className="w-4 h-4 text-white" />
                            </Avatar>
                        )}

                        <div
                            className={cn(
                                "max-w-[80%] rounded-2xl px-4 py-2",
                                message.role === 'user'
                                    ? 'bg-gradient-to-r from-primary to-primary/80 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                            )}
                        >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                                {new Date(message.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>

                        {message.role === 'user' && (
                            <Avatar className="w-8 h-8 bg-gradient-to-br from-accent to-accent/80">
                                <span className="text-white text-sm font-medium">You</span>
                            </Avatar>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <Avatar className="w-8 h-8 bg-gradient-to-br from-primary to-accent">
                            <Sparkles className="w-4 h-4 text-white" />
                        </Avatar>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2 items-center">
                    <VoiceMic
                        onResult={(text) => setInput(prev => prev + (prev ? ' ' : '') + text)}
                        disabled={isLoading}
                    />
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything... (or use voice)"
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="gradient-primary"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                    AI can make mistakes. Verify important information.
                </p>
            </div>
        </Card>
    );
}
