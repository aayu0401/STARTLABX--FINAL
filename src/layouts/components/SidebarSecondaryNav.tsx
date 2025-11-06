"use client";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { User, Settings } from 'lucide-react';

interface SidebarSecondaryNavProps {
  pathname: string;
  onProfile: () => void;
  onSettings: () => void;
}

export function SidebarSecondaryNav({ pathname, onProfile, onSettings }: SidebarSecondaryNavProps) {
  return (
    <div className="border-t -mx-2 pt-2">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="justify-start"
            onClick={onProfile}
            isActive={pathname.startsWith('/profile')}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            className="justify-start"
            onClick={onSettings}
            isActive={pathname.startsWith('/settings')}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
}
