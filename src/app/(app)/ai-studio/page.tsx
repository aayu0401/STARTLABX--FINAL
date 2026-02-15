"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StartupDescriptionTool } from './components/startup-description-tool';
import { MarketAnalysisTool } from './components/market-analysis-tool';
import { TalentSuggestionTool } from './components/talent-suggestion-tool';
import { StudioHeader } from './components/studio-header';
import { PitchDeckTool } from './components/pitch-deck-tool';
import { VCSimulator } from './components/vc-simulator';
import { HiringManager } from './components/hiring-manager';
import { RoadmapTool } from './components/roadmap-tool';
import { LegalDroid } from './components/legal-droid';
import { Sparkles, TrendingUp, Users, Wand2, Presentation, Briefcase, Gem, UserCheck, Map, Scale } from 'lucide-react';

export default function AiStudioPage() {
  return (
    <div className="min-h-screen space-y-8 pb-20 animate-in fade-in duration-1000">
      <StudioHeader />

      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="h-auto flex flex-wrap justify-between gap-2 bg-muted/50 p-2 mb-12 rounded-2xl shadow-inner">
            <TabsTrigger
              value="description"
              className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg flex items-center gap-2 font-bold transition-all"
            >
              <Wand2 className="h-4 w-4" />
              <span className="hidden md:inline">Desc Generator</span>
            </TabsTrigger>
            <TabsTrigger
              value="market"
              className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg flex items-center gap-2 font-bold transition-all"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden md:inline">Market Analyzer</span>
            </TabsTrigger>
            <TabsTrigger
              value="talent"
              className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg flex items-center gap-2 font-bold transition-all"
            >
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Talent Finder</span>
            </TabsTrigger>
            <TabsTrigger
              value="pitch"
              className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg flex items-center gap-2 font-bold transition-all"
            >
              <Presentation className="h-4 w-4" />
              <span className="hidden md:inline">Pitch Architect</span>
            </TabsTrigger>
            <TabsTrigger
              value="vc"
              className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg flex items-center gap-2 font-bold transition-all"
            >
              <Gem className="h-4 w-4" />
              <span className="hidden md:inline">VC Room</span>
            </TabsTrigger>
            <TabsTrigger
              value="hiring"
              className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg flex-1 min-w-[120px] flex items-center justify-center gap-2 font-bold transition-all"
            >
              <UserCheck className="h-4 w-4" />
              <span className="hidden md:inline">Recruit</span>
            </TabsTrigger>
            <TabsTrigger
              value="roadmap"
              className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg flex-1 min-w-[120px] flex items-center justify-center gap-2 font-bold transition-all"
            >
              <Map className="h-4 w-4" />
              <span className="hidden md:inline">Roadmap</span>
            </TabsTrigger>
            <TabsTrigger
              value="legal"
              className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg flex-1 min-w-[120px] flex items-center justify-center gap-2 font-bold transition-all"
            >
              <Scale className="h-4 w-4" />
              <span className="hidden md:inline">Legal</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <StartupDescriptionTool />
          </TabsContent>

          <TabsContent value="market" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <MarketAnalysisTool />
          </TabsContent>

          <TabsContent value="talent" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <TalentSuggestionTool />
          </TabsContent>

          <TabsContent value="pitch" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <PitchDeckTool />
          </TabsContent>

          <TabsContent value="vc" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <VCSimulator />
          </TabsContent>

          <TabsContent value="hiring" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <HiringManager />
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <RoadmapTool />
          </TabsContent>

          <TabsContent value="legal" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <LegalDroid />
          </TabsContent>
        </Tabs>
      </div>

      {/* Feature info footer */}
      <div className="max-w-4xl mx-auto pt-10 grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 grayscale hover:grayscale-0 transition-all hover:opacity-100 cursor-default">
        <div
          className="flex gap-4 p-6 bg-secondary/20 rounded-2xl border border-secondary/50 cursor-pointer hover:bg-secondary/40 transition-colors group"
          onClick={async () => {
            const res = await fetch('/api/checkout', { method: 'POST', body: JSON.stringify({ priceId: 'price_123', userId: 'demo' }) });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
          }}
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">Upgrade to Pro</h5>
            <p className="text-xs text-muted-foreground">Each analysis consumes 1 AI Credit. Upgrade now for unlimited elite insights.</p>
          </div>
        </div>
        <div className="flex gap-4 p-6 bg-secondary/20 rounded-2xl border border-secondary/50">
          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h5 className="font-bold text-xs uppercase tracking-widest mb-1">Real-time Data</h5>
            <p className="text-xs text-muted-foreground">Market trends and talent availability are updated every 24 hours via live platform feeds.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
