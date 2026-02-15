'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { LoadingProvider } from '@/contexts/loading-context';
import { ToastProvider } from '@/components/toast-provider';
import { ErrorBoundary } from '@/components/error-boundary';
import { QueryProvider } from '@/providers/query-provider';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary>
            <QueryProvider>
                <ToastProvider>
                    <AuthProvider>
                        <LoadingProvider>
                            {children}
                        </LoadingProvider>
                    </AuthProvider>
                </ToastProvider>
            </QueryProvider>
        </ErrorBoundary>
    );
}
