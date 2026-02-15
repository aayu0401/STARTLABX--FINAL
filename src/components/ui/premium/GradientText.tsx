import * as React from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
    gradient?: 'primary' | 'accent' | 'purple' | 'sunset' | 'ocean';
    animate?: boolean;
}

const gradientClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-500',
    accent: 'bg-gradient-to-r from-accent-500 to-pink-600',
    purple: 'bg-gradient-to-r from-secondary-500 to-primary-500',
    sunset: 'bg-gradient-to-r from-orange-500 to-accent-500',
    ocean: 'bg-gradient-to-r from-cyan-500 to-primary-500',
};

const GradientText = React.forwardRef<HTMLSpanElement, GradientTextProps>(
    ({ className, gradient = 'primary', animate = false, children, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(
                    'bg-clip-text text-transparent font-bold',
                    gradientClasses[gradient],
                    animate && 'animate-gradient bg-[length:200%_auto]',
                    className
                )}
                {...props}
            >
                {children}
            </span>
        );
    }
);

GradientText.displayName = 'GradientText';

export { GradientText };
