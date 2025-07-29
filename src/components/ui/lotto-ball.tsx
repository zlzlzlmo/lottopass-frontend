import { cn } from '@/lib/utils';

interface LottoBallProps {
  number: number;
  size?: 'sm' | 'md' | 'lg';
  isBonus?: boolean;
  className?: string;
}

export function LottoBall({ number, size = 'md', isBonus = false, className }: LottoBallProps) {
  const getBallColor = (num: number) => {
    if (num <= 10) return 'lotto-ball-yellow';
    if (num <= 20) return 'lotto-ball-blue';
    if (num <= 30) return 'lotto-ball-red';
    if (num <= 40) return 'lotto-ball-green';
    return 'lotto-ball-purple';
  };

  const sizeClass = {
    sm: 'lotto-ball-sm',
    md: 'lotto-ball-md',
    lg: 'lotto-ball-lg',
  }[size];

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'lotto-ball',
          sizeClass,
          isBonus ? 'lotto-ball-gray' : getBallColor(number)
        )}
      >
        {number}
      </div>
      {isBonus && (
        <span className="absolute -top-2 -right-2 text-xs bg-accent text-white px-1 rounded">
          +
        </span>
      )}
    </div>
  );
}