
"use client";
import { AppShellLayout } from '@/layouts/AppShellLayout';
import { AuthProvider } from '@/contexts/auth-context';
import { LoadingProvider } from '@/contexts/loading-context';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <AuthProvider>
        <AppShellLayout>{children}</AppShellLayout>
      </AuthProvider>
    </LoadingProvider>
  );
}
