'use client';

import { useAuth } from '@/contexts/auth-context';
import { useNavigation } from '@/hooks/use-navigation';
import { LandingHeader } from './components/landing/LandingHeader';
import { HeroSection } from './components/landing/HeroSection';
import { FeaturesGrid } from './components/landing/FeaturesGrid';
import { LandingFooter } from './components/landing/LandingFooter';

export default function LandingPage() {
  const { user, logout } = useAuth();
  const { navigateTo } = useNavigation();

  const handleLogout = async () => {
    await logout();
  };

  const handleDashboardNavigation = async () => {
    await navigateTo('/dashboard', { 
      message: 'Loading dashboard...',
      trackEvent: 'home_to_dashboard_navigation'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <LandingHeader user={user} onDashboard={handleDashboardNavigation} onLogout={handleLogout} />

      <main className="flex-grow">
        <HeroSection isAuthenticated={!!user} onDashboard={handleDashboardNavigation} />
        <FeaturesGrid />
      </main>
      <LandingFooter />
    </div>
  );
}
