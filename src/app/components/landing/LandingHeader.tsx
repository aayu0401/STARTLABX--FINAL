"use client";
import Link from 'next/link';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface LandingHeaderProps {
  user: any;
  onDashboard: () => Promise<void> | void;
  onLogout: () => Promise<void> | void;
}

export function LandingHeader({ user, onDashboard, onLogout }: LandingHeaderProps) {
  return (
    <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between z-10">
      <Link href="/" className="flex items-center gap-2">
        <Rocket className="h-7 w-7 text-primary" />
        <span className="text-2xl font-bold font-headline">StartLabX</span>
      </Link>
      <nav className="flex items-center gap-2">
        {user ? (
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onDashboard}>Dashboard</Button>
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
                <DropdownMenuItem onClick={onDashboard}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <>
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
