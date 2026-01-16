import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    href?: string;
    onClick?: () => void;
    className?: string;
}

export function Button({
    children,
    variant = 'primary',
    href,
    onClick,
    className = '',
}: ButtonProps) {
    const baseStyles = `
    inline-flex items-center justify-center gap-2
    px-6 py-3 rounded-lg font-medium
    transition-all duration-300 ease-out
    cursor-pointer
  `;

    const variants = {
        primary: `
      bg-primary text-white
      hover:bg-primary-hover hover:scale-105
      shadow-lg shadow-primary/25
    `,
        secondary: `
      bg-secondary text-background
      hover:bg-secondary-hover hover:scale-105
      shadow-lg shadow-secondary/25
    `,
        outline: `
      border border-border text-text-primary
      hover:border-primary hover:text-primary hover:scale-105
      bg-transparent
    `,
    };

    const combinedStyles = `${baseStyles} ${variants[variant]} ${className}`;

    const MotionComponent = href ? motion.a : motion.button;

    return (
        <MotionComponent
            href={href}
            onClick={onClick}
            className={combinedStyles}
            whileTap={{ scale: 0.98 }}
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
            {children}
        </MotionComponent>
    );
}
