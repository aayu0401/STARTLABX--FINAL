
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthGuard } from '@/components/auth/auth-guard';
import { useAuth } from '@/contexts/auth-context';
import { analyticsService } from '@/services/analytics';
import { useNavigation } from '@/hooks/use-navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Rocket,
  Users,
  LayoutDashboard,
  Wand2,
  Briefcase,
  Lightbulb,
  Bell,
  Settings,
  GitBranch,
  User,
  Building2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { href: "/startups", icon: <Rocket />, label: "Startups" },
  { href: "/talent", icon: <Users />, label: "Talent Marketplace" },
  { href: "/projects", icon: <Briefcase />, label: "Collaboration" },
  { href: "/incubator", icon: <Lightbulb />, label: "Incubator" },
  { href: "/ai-studio", icon: <Wand2 />, label: "AI Studio" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
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
            <Link href="/" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-accent transition-colors duration-200">
              <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-bold tracking-tight group-data-[collapsible=icon]:hidden font-headline">
                StartLabX
              </h2>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={{ children: item.label }}
                    className="justify-start w-full"
                    onClick={() => handleNavClick(item.href, item.label)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="group-data-[collapsible=icon]:hidden">
             <div className="border-t -mx-2 pt-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="justify-start" 
                          onClick={handleProfileClick}
                          isActive={pathname.startsWith('/profile')}
                        >
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                          className="justify-start" 
                          onClick={handleSettingsClick}
                          isActive={pathname.startsWith('/settings')}
                        >
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
             </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1">
          <div className="flex flex-col h-screen">
            <header className="flex h-12 sm:h-14 items-center justify-between border-b px-3 sm:px-4 lg:px-6">
                <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                  <SidebarTrigger />
                   <h1 className="text-sm sm:text-lg lg:text-xl font-semibold tracking-tight font-headline truncate">
                    {getPageTitle()}
                  </h1>
                </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                      <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                        <AvatarImage src="https://placehold.co/100x100" alt="@user" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfileClick}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSettingsClick}>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
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
