"use client";
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function AuthFooterLinks({ mode }: { mode: 'login' | 'signup' }) {
  const linkClass = "underline underline-offset-4 hover:text-primary transition-colors font-medium";

  return (
    <div className="text-center text-sm text-muted-foreground animate-in fade-in duration-700 slide-in-from-bottom-2">
      {mode === 'login' ? (
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className={linkClass}>
            Sign up now
          </Link>
        </p>
      ) : (
        <p>
          Already have an account?{' '}
          <Link href="/login" className={linkClass}>
            Log in
          </Link>
        </p>
      )}
    </div>
  );
}
