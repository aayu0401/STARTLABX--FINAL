'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/toast-provider';

interface VoiceMicProps {
    onResult: (text: string) => void;
    className?: string;
    disabled?: boolean;
}

export function VoiceMic({ onResult, className, disabled }: VoiceMicProps) {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<any>(null);
    const { error } = useToast();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const rec = new SpeechRecognition();
                rec.continuous = false;
                rec.interimResults = true; // Changed to true for realtime feedback feeling
                rec.lang = 'en-US';

                rec.onresult = (event: any) => {
                    // Only take the final result or the last interim
                    const text = Array.from(event.results)
                        .map((result: any) => result[0].transcript)
                        .join('');

                    if (event.results[0].isFinal) {
                        onResult(text);
                        setIsListening(false);
                    }
                };

                rec.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error);
                    if (event.error === 'not-allowed') {
                        error('Microphone Access Denied', 'Please allow microphone access to use voice input.');
                    }
                    setIsListening(false);
                };

                rec.onend = () => {
                    setIsListening(false);
                };

                setRecognition(rec);
            }
        }
    }, [onResult, error]);

    const toggleListening = () => {
        if (!recognition) {
            error('Not Supported', 'Voice input is not supported in this browser.');
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            try {
                recognition.start();
                setIsListening(true);
            } catch (err) {
                console.error("Failed to start", err);
            }
        }
    };

    if (!recognition) return null;

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleListening}
            disabled={disabled}
            className={cn(
                "transition-all duration-300 relative",
                isListening
                    ? "bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                    : "text-muted-foreground hover:text-primary",
                className
            )}
            title={isListening ? "Stop listening" : "Start voice input"}
        >
            {isListening ? (
                <>
                    <span className="absolute inset-0 rounded-full animate-ping bg-red-500/20 opacity-75"></span>
                    <MicOff className="h-5 w-5 relative z-10" />
                </>
            ) : (
                <Mic className="h-5 w-5" />
            )}
        </Button>
    );
}
