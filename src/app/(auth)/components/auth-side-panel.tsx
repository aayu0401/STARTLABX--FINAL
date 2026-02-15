"use client";
import React from 'react';
import { Rocket } from 'lucide-react';

export function AuthSidePanel() {
  return (
    <div className="relative hidden w-full h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"
          alt="Background"
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-black/90" />

      {/* Animated Shapes */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-600/20 rounded-full blur-[100px] animate-float opacity-50" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-600/20 rounded-full blur-[100px] animate-float opacity-50" style={{ animationDelay: '-5s' }} />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative z-20 flex items-center text-lg font-medium gap-2">
        <Rocket className="h-6 w-6 text-purple-400" />
        <span className="font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          StartLabX
        </span>
      </div>

      <div className="relative z-20 mt-auto">
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-1 w-8 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-purple-500 animate-[progress_5s_ease-in-out_infinite]" style={{ animationDelay: `${i * 2}s` }} />
              </div>
            ))}
          </div>

          <blockquote className="space-y-4 glass p-8 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl bg-black/20 hover:bg-black/30 transition-colors">
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              ))}
            </div>
            <p className="text-xl font-light leading-relaxed text-gray-100 italic">
              &ldquo;StartLabX transformed our chaotic startup idea into a structured, fundable business in just 3 weeks with its AI co-pilot.&rdquo;
            </p>
            <footer className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                ES
              </div>
              <div>
                <div className="text-sm font-semibold text-white tracking-wide"> Elena S. </div>
                <div className="text-xs text-purple-300"> Founder, NeuroFlow </div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
