"use client";
import { AuthGuard } from '@/contexts/auth-guard';
import { PublicSiteHeader } from '@/layouts/components/PublicSiteHeader';

export function AuthPublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireAuth={false}>
      <div className="flex min-h-screen flex-col">
        <PublicSiteHeader />
        <main className="flex-grow">{children}</main>
      </div>
    </AuthGuard>
  );
}
