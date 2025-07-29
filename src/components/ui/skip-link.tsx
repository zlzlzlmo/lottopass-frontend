import React from 'react';
import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SkipLink({ 
  href = '#main-content', 
  children = '본문으로 건너뛰기',
  className 
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only',
        'focus:fixed focus:top-4 focus:left-4 focus:z-50',
        'focus:bg-primary focus:text-primary-foreground',
        'focus:px-4 focus:py-2 focus:rounded-md',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'transition-all',
        className
      )}
    >
      {children}
    </a>
  );
}