import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  disabled = false,
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    px-6 py-3 rounded-lg font-medium
    transition-all duration-300 ease-out
    cursor-pointer
  `;

  const variants = {
    primary: `
      bg-primary !text-[#FFFFFF] font-semibold
      hover:bg-primary-hover hover:scale-105
      shadow-lg shadow-primary/25
    `,
    secondary: `
      bg-secondary !text-[#000000] font-semibold
      hover:bg-secondary-hover hover:scale-105
      shadow-lg shadow-secondary/25
    `,
    outline: `
      border border-border text-text-primary
      hover:border-primary hover:text-primary hover:scale-105
      bg-transparent
    `,
  };

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  const combinedStyles = `${baseStyles} ${variants[variant]} ${disabledStyles} ${className}`;

  const MotionComponent = href ? motion.a : motion.button;

  return (
    <MotionComponent
      href={href}
      onClick={disabled ? undefined : onClick}
      className={combinedStyles}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </MotionComponent>
  );
}
