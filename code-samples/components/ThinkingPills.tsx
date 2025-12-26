/**
 * ThinkingPills Component
 * 
 * Animated loading indicator with three pulsing pills.
 * Used during AI generation and data loading states.
 * 
 * Features:
 * - Staggered animation for visual interest
 * - Customizable colors, height, and width via props
 * - Smooth infinite loop animation
 * - Minimal footprint
 * 
 * @example
 * ```tsx
 * // Default blue pills
 * <ThinkingPills />
 * 
 * // Custom colored pills for dark backgrounds
 * <ThinkingPills 
 *   color="bg-white" 
 *   height="h-6" 
 *   width="w-2" 
 * />
 * ```
 */

import React from 'react';
import { motion } from 'framer-motion';

interface ThinkingPillsProps {
  /** Tailwind background color class */
  color?: string;
  
  /** Tailwind height class */
  height?: string;
  
  /** Tailwind width class */
  width?: string;
}

export const ThinkingPills: React.FC<ThinkingPillsProps> = ({ 
  color = "bg-blue-500", 
  height = "h-4", 
  width = "w-1.5" 
}) => (
  <div className="flex gap-1.5 items-center justify-center">
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className={`${width} ${height} ${color} rounded-full`}
        animate={{
          // Vertical pulse effect
          scaleY: [1, 1.5, 1],
          // Fade pulse synchronized with scale
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          // Animation timing
          duration: 0.8,
          // Loop forever
          repeat: Infinity,
          // Stagger each pill by 150ms for wave effect
          delay: i * 0.15
        }}
      />
    ))}
  </div>
);
