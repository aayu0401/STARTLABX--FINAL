"use client";
import Link from 'next/link';

export function AuthFooterLinks({ mode }: { mode: 'login' | 'signup' }) {
  return (
    <div className="text-center text-sm text-muted-foreground">
      {mode === 'login' ? (
        <p>
          Don't have an account?{' '}
          <Link href="/signup" className="underline underline-offset-4">
            Sign up
          </Link>
        </p>
      ) : (
        <p>
          Already have an account?{' '}
          <Link href="/login" className="underline underline-offset-4">
            Log in
          </Link>
        </p>
      )}
    </div>
  );
}
