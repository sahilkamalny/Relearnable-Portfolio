/**
 * GlassButton Component
 * 
 * A polymorphic button component with glassmorphic styling, 
 * Framer Motion animations, and full dark mode support.
 * 
 * Features:
 * - Three variants: primary, secondary, ghost
 * - Loading state with spinner
 * - Optional icon support
 * - Shine animation on primary variant hover
 * - Scale animations on interaction
 * - Full accessibility support
 * 
 * @example
 * ```tsx
 * // Primary button with icon
 * <GlassButton 
 *   variant="primary" 
 *   icon={<Sparkles />}
 *   onClick={handleClick}
 * >
 *   Get Started
 * </GlassButton>
 * 
 * // Secondary button with loading
 * <GlassButton 
 *   variant="secondary" 
 *   isLoading={isSubmitting}
 * >
 *   Submit
 * </GlassButton>
 * ```
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant affecting colors and effects */
  variant?: 'primary' | 'secondary' | 'ghost';
  
  /** Shows loading spinner and disables button */
  isLoading?: boolean;
  
  /** Optional icon to display before children */
  icon?: React.ReactNode;
}

export const GlassButton = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  icon,
  className = '',
  disabled,
  ...props 
}: GlassButtonProps) => {
  // Base styles applied to all variants
  const baseStyles = `
    relative px-6 py-3 rounded-lg font-medium 
    transition-all duration-300 
    flex items-center justify-center gap-2 
    group overflow-hidden
  `;
  
  // Variant-specific styles
  const variants = {
    // Solid button with inverted colors in dark mode
    primary: `
      bg-slate-900 text-white 
      hover:bg-slate-800 
      dark:bg-white dark:text-black dark:hover:bg-gray-100 
      hover:shadow-lg hover:shadow-slate-900/20 
      dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] 
      border border-transparent
    `,
    
    // Glass effect button with backdrop blur
    secondary: `
      bg-white/80 dark:bg-glass-100 
      backdrop-blur-md 
      border border-gray-200 dark:border-glass-border 
      text-slate-900 dark:text-white 
      hover:bg-gray-100 dark:hover:bg-glass-200 
      hover:border-neon-blue/50 
      hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] 
      dark:hover:shadow-[0_0_20px_rgba(0,243,255,0.2)]
    `,
    
    // Minimal ghost button
    ghost: `
      bg-transparent 
      text-slate-700 dark:text-gray-400 
      hover:text-slate-900 dark:hover:text-white 
      hover:bg-black/5 dark:hover:bg-white/5
    `,
  };

  return (
    <motion.button
      // Scale animations for micro-interactions
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      
      // Disable when loading or explicitly disabled
      disabled={isLoading || disabled}
      
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${className} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      {...props}
    >
      {/* Icon or loading spinner */}
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        icon
      )}
      
      {/* Button text */}
      {children}
      
      {/* Shine effect on hover (primary variant only) */}
      {variant === 'primary' && (
        <div 
          className="
            absolute inset-0 -z-10 
            bg-gradient-to-r from-transparent via-white/20 to-transparent 
            translate-x-[-100%] 
            group-hover:translate-x-[100%] 
            transition-transform duration-700
          " 
        />
      )}
    </motion.button>
  );
};
