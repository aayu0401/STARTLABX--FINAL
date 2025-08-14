'use client';

import React from 'react';
import { Rocket } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Logo */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="w-20 h-20 rounded-full border-4 border-primary/20 animate-spin border-t-primary"></div>
          
          {/* Logo in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse">
              <Rocket className="w-8 h-8 text-white animate-bounce" />
            </div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold font-headline text-foreground">
            StartLabX
          </h3>
          <p className="text-sm text-muted-foreground mt-1 animate-pulse">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

// Lightweight loading spinner for smaller use cases
export function LoadingSpinner({ size = "md", className = "" }: { 
  size?: "sm" | "md" | "lg"; 
  className?: string; 
}) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-primary/20 border-t-primary ${sizeClasses[size]} ${className}`} />
  );
}