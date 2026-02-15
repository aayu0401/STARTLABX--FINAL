import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const glassCardVariants = cva(
    'relative overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-300',
    {
        variants: {
            variant: {
                default: 'bg-white/10 border border-white/20 shadow-xl',
                primary: 'bg-primary/10 border border-primary/20 shadow-xl shadow-primary/10',
                accent: 'bg-accent/10 border border-accent/20 shadow-xl shadow-accent/10',
                dark: 'bg-black/20 border border-white/10 shadow-2xl',
            },
            hover: {
                true: 'hover:scale-[1.02] hover:shadow-2xl cursor-pointer',
                false: '',
            },
            glow: {
                true: 'shadow-2xl',
                false: '',
            },
        },
        defaultVariants: {
            variant: 'default',
            hover: false,
            glow: false,
        },
    }
);

export interface GlassCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> { }

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    ({ className, variant, hover, glow, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(glassCardVariants({ variant, hover, glow, className }))}
                {...props}
            >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                {/* Content */}
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        );
    }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard, glassCardVariants };
