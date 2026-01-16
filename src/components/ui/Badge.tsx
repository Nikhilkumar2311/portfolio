import type { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'primary' | 'secondary';
    className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
    const variants = {
        default: 'bg-surface border border-border text-text-secondary',
        primary: 'bg-primary/10 border border-primary/30 text-primary',
        secondary: 'bg-secondary/10 border border-secondary/30 text-secondary',
    };

    return (
        <span
            className={`
        inline-flex items-center gap-1.5
        px-3 py-1.5 rounded-full
        text-sm font-mono font-medium
        transition-colors duration-200
        ${variants[variant]}
        ${className}
      `}
        >
            {children}
        </span>
    );
}
