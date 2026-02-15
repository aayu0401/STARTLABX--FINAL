'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });

        // Log to error reporting service (e.g., Sentry)
        if (typeof window !== 'undefined') {
            // window.reportError?.(error, errorInfo);
        }
    }

    private handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    private handleGoHome = () => {
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
                    <Card className="max-w-2xl w-full glass border-destructive/20">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                                <AlertTriangle className="h-8 w-8 text-destructive" />
                            </div>
                            <CardTitle className="text-2xl">Oops! Something went wrong</CardTitle>
                            <CardDescription className="text-base mt-2">
                                We encountered an unexpected error. Don't worry, we're on it!
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                                    <p className="text-sm font-mono text-destructive mb-2">
                                        <strong>Error:</strong> {this.state.error.message}
                                    </p>
                                    {this.state.errorInfo && (
                                        <details className="mt-2">
                                            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                                                View stack trace
                                            </summary>
                                            <pre className="mt-2 text-xs overflow-auto max-h-48 p-2 bg-background/50 rounded">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button
                                    variant="gradient"
                                    size="lg"
                                    onClick={this.handleReset}
                                    className="gap-2"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Try Again
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={this.handleGoHome}
                                    className="gap-2"
                                >
                                    <Home className="h-4 w-4" />
                                    Go Home
                                </Button>
                            </div>

                            <div className="text-center text-sm text-muted-foreground">
                                <p>If this problem persists, please contact support.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

// Simple error fallback component
export function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-center max-w-md">
                {error.message || 'An unexpected error occurred'}
            </p>
            <Button onClick={resetError} variant="gradient">
                Try again
            </Button>
        </div>
    );
}
