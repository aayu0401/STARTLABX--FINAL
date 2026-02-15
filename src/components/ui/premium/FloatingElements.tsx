'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface FloatingElementsProps {
    count?: number;
    className?: string;
}

export function FloatingElements({ count = 5, className }: FloatingElementsProps) {
    const elements = Array.from({ length: count }, (_, i) => i);

    return (
        <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
            {elements.map((i) => (
                <div
                    key={i}
                    className="absolute rounded-full opacity-20 blur-3xl animate-float"
                    style={{
                        width: `${Math.random() * 300 + 100}px`,
                        height: `${Math.random() * 300 + 100}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        background: `linear-gradient(135deg, 
              hsl(${Math.random() * 360}, 70%, 60%), 
              hsl(${Math.random() * 360}, 70%, 60%))`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${Math.random() * 10 + 10}s`,
                    }}
                />
            ))}
        </div>
    );
}
