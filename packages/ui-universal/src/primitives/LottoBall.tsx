import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const lottoBallVariants = cva(
  'inline-flex items-center justify-center rounded-full font-bold text-white shadow-lg transition-all',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-14 w-14 text-lg',
      },
      variant: {
        default: '',
        bonus: 'ring-2 ring-offset-2',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface LottoBallProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof lottoBallVariants> {
  number: number;
  isBonus?: boolean;
}

export const LottoBall = React.forwardRef<HTMLDivElement, LottoBallProps>(
  ({ className, size, variant, number, isBonus = false, ...props }, ref) => {
    const getColor = (num: number) => {
      if (num <= 10) return 'bg-yellow-500';
      if (num <= 20) return 'bg-blue-500';
      if (num <= 30) return 'bg-red-500';
      if (num <= 40) return 'bg-gray-600';
      return 'bg-green-500';
    };

    return (
      <div
        ref={ref}
        className={cn(
          lottoBallVariants({ size, variant: isBonus ? 'bonus' : variant }),
          getColor(number),
          isBonus && 'ring-purple-500',
          className
        )}
        {...props}
      >
        {number}
      </div>
    );
  }
);

LottoBall.displayName = 'LottoBall';