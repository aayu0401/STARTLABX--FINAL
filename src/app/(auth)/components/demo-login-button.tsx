"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useNavigation } from '@/hooks/use-navigation';
import { toast } from '@/hooks/use-toast';
import { Rocket } from 'lucide-react';
import { analyticsService } from '@/services/analytics.service';
import { authService } from '@/services/auth.service';

export function DemoLoginButton() {
    const { login } = useAuth();
    const { navigateTo } = useNavigation();
    const [loading, setLoading] = React.useState(false);

    const handleDemoLogin = async () => {
        setLoading(true);
        const demoEmail = 'demo@startlabx.com';
        const demoPass = 'DemoPass123!';

        try {
            // 1. Attempt login. AuthContext now handles offline fallback for this specific email.
            // It will NOT throw if backend is down, it will set offline mode.
            await login(demoEmail, demoPass);

            // Track success (non-blocking)
            analyticsService.trackLogin(true, 'demo').catch(e => console.warn("Analytics failed", e));

            toast({
                title: "Welcome back, Founder!",
                description: "Demo session initialized (Offline Ready)."
            });

            await navigateTo('/dashboard');
        } catch (error: any) {
            console.error("Demo login unexpected failure:", error);
            // This really shouldn't happen with the AuthContext fallback, but just in case:
            toast({
                variant: "destructive",
                title: "Demo Error",
                description: "Could not initialize demo. Please reload and try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            type="button"
            variant="ghost"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 text-purple-400 border border-purple-500/20 hover:border-purple-500/40 transition-all font-medium h-12"
        >
            <Rocket className="mr-2 h-4 w-4 animate-pulse" />
            {loading ? "Launching Demo..." : "Instant Demo Access"}
        </Button>
    );
}
