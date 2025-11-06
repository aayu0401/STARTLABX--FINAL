"use client";
import { NavItem } from './types';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

interface SidebarNavProps {
  items: NavItem[];
  pathname: string;
  onNavigate: (href: string, label: string) => void;
}

export function SidebarNav({ items, pathname, onNavigate }: SidebarNavProps) {
  return (
    <SidebarMenu>
      {items.map(item => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            isActive={pathname.startsWith(item.href)}
            tooltip={{ children: item.label }}
            className="justify-start w-full"
            onClick={() => onNavigate(item.href, item.label)}
          >
            {item.icon}
            <span>{item.label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
