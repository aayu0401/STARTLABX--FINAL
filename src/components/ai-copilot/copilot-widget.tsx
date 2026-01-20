'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { CopilotChat } from './copilot-chat';

interface CopilotWidgetProps {
    userType: 'startup' | 'professional';
}

export function CopilotWidget({ userType }: CopilotWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {isOpen && (
                <CopilotChat
                    userType={userType}
                    onClose={() => setIsOpen(false)}
                    isWidget={true}
                />
            )}

            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center group"
                    aria-label="Open AI Copilot"
                >
                    <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </button>
            )}
        </>
    );
}
