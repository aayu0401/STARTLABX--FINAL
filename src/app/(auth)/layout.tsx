"use client";

import { AuthPublicLayout } from '@/layouts/AuthPublicLayout';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthPublicLayout>{children}</AuthPublicLayout>;
}
