import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const animatedButtonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-white shadow-lg hover:shadow-xl hover:scale-105',
                gradient:
                    'bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-2xl hover:scale-105',
                gradientAccent:
                    'bg-gradient-to-r from-accent to-pink-600 text-white shadow-lg hover:shadow-2xl hover:scale-105',
                glass:
                    'bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-xl hover:bg-white/20 hover:scale-105',
                outline:
                    'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white hover:scale-105',
                ghost:
                    'hover:bg-primary/10 hover:text-primary hover:scale-105',
                glow:
                    'bg-primary text-white shadow-lg shadow-primary/50 hover:shadow-2xl hover:shadow-primary/70 hover:scale-105',
            },
            size: {
                sm: 'h-9 px-4 text-xs',
                default: 'h-11 px-6 py-2',
                lg: 'h-13 px-8 text-base',
                xl: 'h-16 px-10 text-lg',
                icon: 'h-11 w-11',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface AnimatedButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof animatedButtonVariants> {
    asChild?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
    ({ className, variant, size, asChild = false, loading, icon, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';

        return (
            <Comp
                className={cn(animatedButtonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <span>Loading...</span>
                    </>
                ) : (
                    <>
                        {icon && <span className="flex-shrink-0">{icon}</span>}
                        {children}
                    </>
                )}
            </Comp>
        );
    }
);

AnimatedButton.displayName = 'AnimatedButton';

export { AnimatedButton, animatedButtonVariants };
