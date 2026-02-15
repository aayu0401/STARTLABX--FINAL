"use client";
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserMenu } from './UserMenu';
import { NotificationsDropdown } from './NotificationsDropdown';

interface HeaderBarProps {
  title: string;
  onProfile: () => void;
  onSettings: () => void;
  onLogout: () => void;
}

export function HeaderBar({ title, onProfile, onSettings, onLogout }: HeaderBarProps) {
  return (
    <header className="flex h-12 sm:h-14 items-center justify-between border-b px-3 sm:px-4 lg:px-6 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <SidebarTrigger />
        <h1 className="text-sm sm:text-lg lg:text-xl font-bold tracking-tight font-headline truncate bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <NotificationsDropdown />
        <UserMenu onProfile={onProfile} onSettings={onSettings} onLogout={onLogout} />
      </div>
    </header>
  );
}
