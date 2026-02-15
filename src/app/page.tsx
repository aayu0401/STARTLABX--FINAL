"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Rocket, Shield, Zap, Target, Users, Sparkles, Globe, Cpu, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShowcaseSection } from '@/app/components/landing/ShowcaseSection';
import { FAQSection } from '@/app/components/landing/FAQSection';
import { MouseGlow } from '@/components/ui/mouse-glow';
import { useNavigation } from '@/hooks/use-navigation';

export default function LandingPage() {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden font-sans">
      <MouseGlow />

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full animate-float opacity-40" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full animate-float opacity-40" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-pink-600/10 blur-[120px] rounded-full animate-pulse-subtle opacity-30" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform duration-300">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">StartLabX</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Showcase', 'Pricing', 'FAQ'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-gray-300 hover:text-white transition-colors hover:shadow-glow">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('/login', { message: 'Entering workspace...' })}
              className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white mr-2 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigateTo('/signup', { message: 'Creating your account...' })}
              className="bg-white text-black hover:bg-gray-100 px-5 py-2.5 rounded-full font-semibold text-sm transition-all transform hover:scale-105 shadow-lg hover:shadow-white/20 flex items-center gap-2"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-6 text-center mb-32 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full blur-[100px] -z-10 animate-pulse-slow" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 animate-slide-in-up backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-gray-200 tracking-wide">The Operating System for Founders</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-8 animate-slide-up filter drop-shadow-2xl">
            BUILD YOUR <br />
            <span className="animate-shimmer-text">
              EMPIRE FASTER
            </span>
            <span className="hidden">STARTLABX-CHECKPOINT</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-300 mb-12 animate-slide-up leading-relaxed font-light opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: '200ms' }}>
            The all-in-one platform to validate ideas, recruit elite talent, and scale your startup using advanced AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up opacity-0 [animation-fill-mode:forwards]" style={{ animationDelay: '400ms' }}>
            <button
              onClick={() => navigateTo('/signup', { message: 'Accelerating growth...' })}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-full font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2"
            >
              <Rocket className="h-5 w-5" />
              Start Building Free
            </button>
            <Link href="#showcase">
              <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm flex items-center gap-2 group">
                Watch Demo <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse group-hover:bg-green-400" />
              </button>
            </Link>
          </div>

          {/* Social Proof / Stats */}
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 hover:opacity-100 transition-opacity duration-500">
            {[{ label: "Startups Launched", value: "2,500+" }, { label: "Talent Pool", value: "15k+" }, { label: "Capital Raised", value: "$45M+" }].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Showcase Section */}
        <ShowcaseSection />

        {/* Feature Grid */}
        <section className="container mx-auto px-6 py-24 scroll-mt-24" id="features">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything You Need to Scale</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Replace a dozen fragmented tools with one cohesive ecosystem designed for hyper-growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Cpu className="h-8 w-8 text-white" />}
              title="AI Co-pilot"
              description="Deploy bespoke AI models to generate code, business plans, and marketing strategies in seconds."
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8 text-white" />}
              title="Talent Network"
              description="Recruit battle-tested engineers and designers who are ready to build for equity or liquidity."
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-white" />}
              title="IP Fortress"
              description="Protect your innovations with blockchain-verified legal templates and instant IP registration."
              gradient="from-emerald-500 to-teal-500"
            />
            <FeatureCard
              icon={<Target className="h-8 w-8 text-white" />}
              title="Market Trends"
              description="Real-time analytics to validate your product-market fit before you write a single line of code."
              gradient="from-orange-500 to-red-500"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-white" />}
              title="Instant Deploy"
              description="One-click deployment to global edge networks with built-in scalability and security."
              gradient="from-yellow-500 to-amber-500"
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8 text-white" />}
              title="Global Compliance"
              description="Automated legal compliance across 120+ countries so you can hire anyone, anywhere."
              gradient="from-indigo-500 to-violet-500"
            />
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-24 mb-20">
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-black p-12 md:p-24 text-center border border-white/10 group">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 blur-[100px] rounded-full animate-pulse-slow" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/30 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '-2s' }} />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white">
                Ready to Launch?
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
                Join thousands of founders building the next unicorn on StartLabX. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/signup">
                  <button className="px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 hover:shadow-xl hover:shadow-white/20 transition-all transform hover:-translate-y-1">
                    Get Started for Free
                  </button>
                </Link>
                <Link href="/login">
                  <button className="px-10 py-5 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors backdrop-blur-sm">
                    Log In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="py-20 border-t border-white/5 relative z-10 bg-black">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-8 opacity-80 hover:opacity-100 transition-opacity">
            <div className="p-2 bg-white/10 rounded-lg">
              <Rocket className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">StartLabX</span>
          </div>
          <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
            Accelerating humanity by empowering the next generation of founders. <br />
            Built with ❤️ in the Cloud.
          </p>
          <div className="flex justify-center gap-8 text-gray-400 font-medium text-sm">
            {['Privacy', 'Terms', 'Security', 'Twitter', 'LinkedIn'].map(link => (
              <a key={link} href="#" className="hover:text-white hover:underline underline-offset-4 transition-all">{link}</a>
            ))}
          </div>
          <div className="mt-12 text-xs text-gray-600">
            © {new Date().getFullYear()} StartLabX Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode, title: string, description: string, gradient: string }) {
  return (
    <div className="group relative p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

      <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-4 tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors">
        {title}
      </h3>

      <p className="text-gray-400 leading-relaxed text-base group-hover:text-gray-300 transition-colors">
        {description}
      </p>

      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
        <ArrowRight className="h-5 w-5 text-white/50" />
      </div>
    </div>
  );
}
