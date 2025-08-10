"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  SidebarMenuAction,
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
  RefreshCw,
  X,
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

const initialNavItems = [
  { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { href: "/startups", icon: <Rocket />, label: "Startup Showcase" },
  { href: "/talent", icon: <Users />, label: "Talent Marketplace" },
  { href: "/projects", icon: <Briefcase />, label: "Collaboration" },
  { href: "/incubator", icon: <Lightbulb />, label: "Incubator" },
  { href: "/ai-studio", icon: <Wand2 />, label: "AI Studio" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState(initialNavItems);

  const handleRemoveItem = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setNavItems(currentItems => currentItems.filter(item => item.href !== href));
  };
  
  const handleResetNav = () => {
    setNavItems(initialNavItems);
  }

  const getPageTitle = () => {
    const activeItem = initialNavItems.find(item => pathname.startsWith(item.href));
    return activeItem ? activeItem.label : 'Dashboard';
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2.5">
              <Rocket className="w-7 h-7 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground group-data-[collapsible=icon]:hidden font-headline">
                StartLabX
              </h2>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} className="flex-grow">
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href)}
                      tooltip={{ children: item.label }}
                      className="justify-start w-full"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                   <SidebarMenuAction 
                      showOnHover 
                      onClick={(e) => handleRemoveItem(item.href, e)}
                      aria-label={`Remove ${item.label}`}
                    >
                      <X />
                    </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="group-data-[collapsible=icon]:hidden">
             <div className="border-t -mx-2 pt-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                         <SidebarMenuButton className="justify-start" onClick={handleResetNav}>
                            <RefreshCw className="w-4 h-4" />
                            <span>Reset Navigation</span>
                         </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                         <Link href="#">
                            <SidebarMenuButton className="justify-start">
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
             </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex flex-col h-full">
            <header className="flex h-16 items-center justify-between border-b px-4 sm:px-6">
                <div className="flex items-center gap-4">
                  <SidebarTrigger className="md:hidden" />
                   <h1 className="text-xl font-semibold tracking-tight font-headline">
                    {getPageTitle()}
                  </h1>
                </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://placehold.co/100x100" alt="@user" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              {children}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
