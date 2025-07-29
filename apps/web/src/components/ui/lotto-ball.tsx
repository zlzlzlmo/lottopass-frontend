import { cn } from '@/lib/utils';

interface LottoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LottoBall({ number, size = 'md', className }: LottoBallProps) {
  const getBallColor = (num: number) => {
    if (num <= 10) return 'lotto-ball-yellow';
    if (num <= 20) return 'lotto-ball-blue';
    if (num <= 30) return 'lotto-ball-red';
    if (num <= 40) return 'lotto-ball-green';
    return 'lotto-ball-purple';
  };

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <div
      className={cn(
        'lotto-ball',
        getBallColor(number),
        sizeClasses[size],
        className
      )}
    >
      {number}
    </div>
  );
}