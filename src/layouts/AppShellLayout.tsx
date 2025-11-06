"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AuthGuard } from '@/contexts/auth-guard';
import { useAuth } from '@/contexts/auth-context';
import { analyticsService } from '@/services/analytics';
import { useNavigation } from '@/hooks/use-navigation';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset, SidebarRail } from "@/components/ui/sidebar";
import { Rocket, Users, LayoutDashboard, Wand2, Briefcase, Lightbulb } from "lucide-react";
import { SidebarBrand } from '@/layouts/components/SidebarBrand';
import { SidebarNav } from '@/layouts/components/SidebarNav';
import { SidebarSecondaryNav } from '@/layouts/components/SidebarSecondaryNav';
import { HeaderBar } from '@/layouts/components/HeaderBar';
import { NavItem } from '@/layouts/components/types';

const navItems: NavItem[] = [
  { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { href: "/startups", icon: <Rocket />, label: "Startups" },
  { href: "/talent", icon: <Users />, label: "Talent Marketplace" },
  { href: "/projects", icon: <Briefcase />, label: "Collaboration" },
  { href: "/incubator", icon: <Lightbulb />, label: "Incubator" },
  { href: "/ai-studio", icon: <Wand2 />, label: "AI Studio" },
];

export function AppShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { navigateTo } = useNavigation();

  const getPageTitle = () => {
    if (pathname.startsWith('/profile')) return 'Profile';
    if (pathname.startsWith('/settings')) return 'Settings';
    if (pathname.startsWith('/list-startup')) return 'List Startup';
    const activeItem = navItems.find(item => pathname.startsWith(item.href));
    return activeItem ? activeItem.label : 'Dashboard';
  };

  const handleLogout = async () => {
    await analyticsService.trackButtonClick('logout', 'header_dropdown');
    await logout();
  };

  const handleNavClick = async (href: string, label: string) => {
    await navigateTo(href, {
      message: `Loading ${label}...`,
      trackEvent: 'sidebar_navigation'
    });
  };

  const handleProfileClick = async () => {
    await navigateTo('/profile', {
      message: 'Loading profile...',
      trackEvent: 'profile_navigation'
    });
  };

  const handleSettingsClick = async () => {
    await navigateTo('/settings', {
      message: 'Loading settings...',
      trackEvent: 'settings_navigation'
    });
  };

  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex min-h-screen w-full max-w-full overflow-hidden">
          <Sidebar collapsible="icon">
            <SidebarRail />
            <SidebarHeader className="p-4">
              <SidebarBrand />
            </SidebarHeader>
            <SidebarContent>
              <SidebarNav items={navItems} pathname={pathname} onNavigate={handleNavClick} />
            </SidebarContent>
            <SidebarFooter className="group-data-[collapsible=icon]:hidden">
              <SidebarSecondaryNav
                pathname={pathname}
                onProfile={handleProfileClick}
                onSettings={handleSettingsClick}
              />
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="flex-1">
            <div className="flex flex-col h-screen">
              <HeaderBar
                title={getPageTitle()}
                onProfile={handleProfileClick}
                onSettings={handleSettingsClick}
                onLogout={handleLogout}
              />
              <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 lg:p-6">
                {children}
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
