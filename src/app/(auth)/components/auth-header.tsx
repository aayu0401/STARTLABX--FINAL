import { cn } from '@/lib/utils';
import { Rocket } from 'lucide-react';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function AuthHeader({ title, subtitle, className }: AuthHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center space-y-4 text-center mb-6", className)}>
      <div className="bg-gradient-premium p-3 rounded-2xl shadow-lg transform hover:rotate-12 transition-transform duration-300">
        <Rocket className="h-6 w-6 text-white" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
