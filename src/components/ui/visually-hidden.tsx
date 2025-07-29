import React from 'react';
import { cn } from '@/lib/utils';

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

/**
 * Visually hides content while keeping it accessible to screen readers
 * Useful for providing context that is obvious visually but needed for accessibility
 */
export function VisuallyHidden({ children, className, ...props }: VisuallyHiddenProps) {
  return (
    <span
      className={cn(
        'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * Alternative implementation as a CSS class for use with other components
 */
export const visuallyHiddenClassName = 'sr-only';