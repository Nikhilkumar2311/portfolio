import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
}

export function Card({ children, className = '', hover = true }: CardProps) {
    return (
        <motion.div
            className={`
        bg-surface rounded-xl border border-border
        p-6 transition-all duration-300
        ${hover ? 'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5' : ''}
        ${className}
      `}
            whileHover={hover ? { y: -4 } : undefined}
        >
            {children}
        </motion.div>
    );
}
