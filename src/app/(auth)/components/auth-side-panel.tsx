"use client";
import React from 'react';

export function AuthSidePanel() {
  return (
    <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div
        className="absolute inset-0 bg-cover"
        style={{ backgroundImage: 'url(https://placehold.co/1080x1920.png)' }}
        data-ai-hint="startup office"
      />
      <div className="relative z-20 flex items-center text-lg font-medium">
        StartLabX
      </div>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2">
          <p className="text-lg">&ldquo;The best way to predict the future is to create it.&rdquo;</p>
          <footer className="text-sm">Peter Drucker</footer>
        </blockquote>
      </div>
    </div>
  );
}
