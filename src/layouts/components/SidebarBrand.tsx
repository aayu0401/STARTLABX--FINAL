"use client";
import Link from 'next/link';
import { Rocket } from 'lucide-react';

export function SidebarBrand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-accent transition-colors duration-200">
      <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md">
        <Rocket className="w-4 h-4 text-white" />
      </div>
      <h2 className="text-lg font-bold tracking-tight group-data-[collapsible=icon]:hidden font-headline">
        StartLabX
      </h2>
    </Link>
  );
}
