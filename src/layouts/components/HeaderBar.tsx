"use client";
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { UserMenu } from './UserMenu';

interface HeaderBarProps {
  title: string;
  onProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
}

export function HeaderBar({ title, onProfile, onSettings, onLogout }: HeaderBarProps) {
  return (
    <header className="flex h-12 sm:h-14 items-center justify-between border-b px-3 sm:px-4 lg:px-6">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <SidebarTrigger />
        <h1 className="text-sm sm:text-lg lg:text-xl font-semibold tracking-tight font-headline truncate">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <UserMenu onProfile={onProfile} onSettings={onSettings} onLogout={onLogout} />
      </div>
    </header>
  );
}
