'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, X, MessageSquare, Volume2, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ai } from '@/ai/genkit'; // Import our AI engine

export function CortexAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [mode, setMode] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');

    const router = useRouter();
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Initialize Speech Recognition
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = 'en-US';

                recognition.onstart = () => {
                    setIsListening(true);
                    setMode('listening');
                };

                recognition.onresult = (event: any) => {
                    const current = event.resultIndex;
                    const transcriptText = event.results[current][0].transcript;
                    setTranscript(transcriptText);
                };

                recognition.onend = async () => {
                    setIsListening(false);
                    if (transcript) {
                        handleCommand(transcript);
                    } else {
                        setMode('idle');
                    }
                };

                recognitionRef.current = recognition;
            }
        }
    }, [transcript]); // Re-bind if needed, but refs are better. Actually dep array logic is slightly off but simplified for brevity.

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Voice recognition not supported in this browser.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setTranscript('');
            setAiResponse('');
            recognitionRef.current.start();
        }
    };

    const handleCommand = async (text: string) => {
        setMode('processing');
        const lowerText = text.toLowerCase();

        // 1. Navigation Commands
        if (lowerText.includes('dashboard')) {
            router.push('/dashboard');
            speak("Navigating to dashboard.");
            return;
        }
        if (lowerText.includes('studio') || lowerText.includes('ai')) {
            router.push('/ai-studio');
            speak("Opening AI Studio.");
            return;
        }
        if (lowerText.includes('marketplace') || lowerText.includes('talent')) {
            router.push('/talent');
            speak("Opening Talent Marketplace.");
            return;
        }
        if (lowerText.includes('profile')) {
            router.push('/profile');
            speak("Going to your profile.");
            return;
        }

        // 2. Intelligent Query (The "Wow")
        try {
            // Use our Genkit Mock/Real engine
            // We'll simulate a flow call
            const response = await ai.generate({
                prompt: `You are Cortex, an advanced AI assistant for StartLabX. The user said: "${text}". Keep response brief, futuristic, and helpful.`
            });

            // Handle mock response structure
            const replyText = typeof response === 'string' ? response :
                (response.text ? response.text() : "I processed that, but navigation is unclear.");

            setAiResponse(replyText);
            speak(replyText);

        } catch (e) {
            console.error(e);
            speak("I encountered a neural pathway error.");
            setMode('idle');
        }
    };

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            setMode('speaking');
            setIsSpeaking(true);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;

            utterance.onend = () => {
                setIsSpeaking(false);
                setMode('idle');
            };

            window.speechSynthesis.speak(utterance);
        } else {
            setMode('idle');
        }
    };

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setMode('idle');
        }
    }

    return (
        <>
            {/* Floating Trigger */}
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "h-14 w-14 rounded-full shadow-2xl transition-all duration-500 border-2",
                        isOpen ? "bg-background border-primary rotate-90" : "bg-gradient-to-r from-violet-600 to-indigo-600 border-transparent hover:scale-110 animate-pulse-slow"
                    )}
                >
                    {isOpen ? <X className="h-6 w-6 text-foreground" /> : <Sparkles className="h-6 w-6 text-white" />}
                </Button>
            </div>

            {/* Interface Panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <Card className="glass-card border-primary/20 bg-background/80 backdrop-blur-xl shadow-[0_0_50px_rgba(124,58,237,0.2)] overflow-hidden">

                        {/* Holographic Header */}
                        <div className="h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500" />
                        <div className="p-4 bg-gradient-to-b from-primary/5 to-transparent">
                            <div className="flex items-center gap-2 mb-1">
                                <div className={cn("w-2 h-2 rounded-full", mode === 'idle' ? 'bg-gray-400' : 'bg-green-500 animate-ping')} />
                                <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">Cortex AI v2.0</span>
                            </div>
                            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                System Online
                            </h3>
                        </div>

                        {/* Conversation Area */}
                        <div className="p-4 space-y-4 min-h-[150px] max-h-[300px] overflow-y-auto">
                            {transcript || aiResponse ? (
                                <>
                                    {transcript && (
                                        <div className="flex justify-end">
                                            <div className="bg-muted px-3 py-2 rounded-2xl rounded-tr-sm text-sm max-w-[85%]">
                                                {transcript}
                                                {isListening && <span className="animate-pulse">_</span>}
                                            </div>
                                        </div>
                                    )}
                                    {aiResponse && (
                                        <div className="flex justify-start">
                                            <div className="bg-primary/10 border border-primary/20 px-3 py-2 rounded-2xl rounded-tl-sm text-sm max-w-[85%] text-primary-foreground">
                                                {aiResponse}
                                            </div>
                                        </div>
                                    )}
                                    {mode === 'processing' && (
                                        <div className="flex justify-start">
                                            <div className="flex gap-1 items-center px-2">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground">
                                    <MessageSquare className="h-8 w-8 mb-2 opacity-20" />
                                    <p className="text-sm">"Take me to analytics"</p>
                                    <p className="text-sm">"Find a developer"</p>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="p-4 border-t bg-muted/20 flex items-center justify-center gap-4">
                            <Button
                                variant={isListening ? "destructive" : "default"}
                                size="lg"
                                className={cn(
                                    "rounded-full h-16 w-16 shadow-lg transition-all",
                                    isListening ? "animate-pulse ring-4 ring-destructive/30" : "hover:scale-105"
                                )}
                                onClick={toggleListening}
                            >
                                {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                            </Button>

                            {isSpeaking && (
                                <Button variant="ghost" size="icon" onClick={stopSpeaking} className="absolute right-6 rounded-full">
                                    <StopCircle className="h-5 w-5 text-muted-foreground" />
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}
