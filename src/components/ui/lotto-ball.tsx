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

  const getColorName = (num: number) => {
    if (num <= 10) return '노란색';
    if (num <= 20) return '파란색';
    if (num <= 30) return '빨간색';
    if (num <= 40) return '초록색';
    return '보라색';
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
        role="img"
        aria-label={`${isBonus ? '보너스 ' : ''}로또 번호 ${number}번${isBonus ? '' : `, ${getColorName(number)} 공`}`}
        tabIndex={0}
      >
        <span aria-hidden="true">{number}</span>
      </div>
      {isBonus && (
        <span 
          className="absolute -top-2 -right-2 text-xs bg-accent text-white px-1 rounded"
          aria-hidden="true"
        >
          +
        </span>
      )}
    </div>
  );
}