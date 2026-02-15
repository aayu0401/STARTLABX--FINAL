"use client";
import React from 'react';
import Image from 'next/image';
import { ArrowRight, CheckCircle } from 'lucide-react';

export function ShowcaseSection() {
    return (
        <section className="py-24 bg-gradient-to-b from-black to-zinc-900 text-white relative overflow-hidden" id="showcase">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span>Live Platform Demo</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
                            Visualize Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                                Future Success
                            </span>
                        </h2>

                        <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                            Experience a unified workspace where every tool is designed to accelerate your growth. From initial validation to scaling operations, StartLabX is your command center.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {[
                                "AI-driven market validation in minutes",
                                "Instant access to verified talent pools",
                                "Automated legal and compliance workflows",
                                "Real-time analytics dashboard"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span className="text-gray-300">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <button className="group flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-8 py-3 rounded-full transition-all font-medium shadow-lg shadow-blue-500/20">
                            Explore Features <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="lg:w-1/2 relative group">
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[2rem] opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-500"></div>
                        <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900/50 backdrop-blur-sm aspect-video flex items-center justify-center">
                            {/* Placeholder for App Screenshot */}
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950 p-6 flex flex-col gap-4">
                                {/* Mock UI Header */}
                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                    </div>
                                    <div className="h-2 w-20 bg-white/10 rounded-full"></div>
                                </div>
                                {/* Mock UI Body */}
                                <div className="flex-1 flex gap-4">
                                    <div className="w-1/4 h-full bg-white/5 rounded-xl animate-pulse"></div>
                                    <div className="flex-1 flex flex-col gap-4">
                                        <div className="h-32 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer"></div>
                                        </div>
                                        <div className="flex-1 bg-white/5 rounded-xl border border-white/5 grid grid-cols-2 gap-4 p-4">
                                            <div className="bg-white/5 rounded-lg"></div>
                                            <div className="bg-white/5 rounded-lg"></div>
                                            <div className="bg-white/5 rounded-lg col-span-2"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Optional minimal text overlay */}
                            <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-xs font-mono text-blue-300">
                                System: Online
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
