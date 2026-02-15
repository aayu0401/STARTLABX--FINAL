"use client";
import React from 'react';

export function AuthContainer({ children, widthClass = 'sm:w-[400px]' }: { children: React.ReactNode; widthClass?: string }) {
  return (
    <div className={`relative mx-auto flex w-full flex-col justify-center space-y-6 sm:p-10 ${widthClass}`}>
      {/* Background Glow Effects */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s' }} />

      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-50 animate-pulse-slow -z-10" />

      <div className="glass-premium p-8 rounded-3xl shadow-[0_0_50px_-12px_rgba(124,58,237,0.25)] backdrop-blur-2xl relative z-10 transition-all duration-500 hover:shadow-[0_0_70px_-12px_rgba(124,58,237,0.4)] border border-white/10 bg-black/40">
        {children}
      </div>
    </div>
  );
}
