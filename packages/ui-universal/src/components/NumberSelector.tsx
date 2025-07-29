import React, { useCallback } from 'react';
import { cn } from '../utils/cn';

export interface NumberSelectorProps {
  selectedNumbers: number[];
  onNumbersChange: (numbers: number[]) => void;
  maxNumbers?: number;
  minNumber?: number;
  maxNumber?: number;
  disabled?: boolean;
  className?: string;
}

export const NumberSelector: React.FC<NumberSelectorProps> = ({
  selectedNumbers,
  onNumbersChange,
  maxNumbers = 6,
  minNumber = 1,
  maxNumber = 45,
  disabled = false,
  className,
}) => {
  const handleNumberClick = useCallback(
    (number: number) => {
      if (disabled) return;

      const isSelected = selectedNumbers.includes(number);

      if (isSelected) {
        onNumbersChange(selectedNumbers.filter((n) => n !== number));
      } else if (selectedNumbers.length < maxNumbers) {
        onNumbersChange([...selectedNumbers, number]);
      }
    },
    [selectedNumbers, onNumbersChange, maxNumbers, disabled]
  );

  const getNumberColor = (number: number) => {
    if (number <= 10) return 'hover:bg-yellow-100 data-[selected=true]:bg-yellow-500';
    if (number <= 20) return 'hover:bg-blue-100 data-[selected=true]:bg-blue-500';
    if (number <= 30) return 'hover:bg-red-100 data-[selected=true]:bg-red-500';
    if (number <= 40) return 'hover:bg-gray-100 data-[selected=true]:bg-gray-600';
    return 'hover:bg-green-100 data-[selected=true]:bg-green-500';
  };

  const numbers = Array.from(
    { length: maxNumber - minNumber + 1 },
    (_, i) => minNumber + i
  );

  return (
    <div className={cn('grid grid-cols-7 gap-2 p-4', className)}>
      {numbers.map((number) => {
        const isSelected = selectedNumbers.includes(number);
        return (
          <button
            key={number}
            onClick={() => handleNumberClick(number)}
            disabled={disabled || (!isSelected && selectedNumbers.length >= maxNumbers)}
            data-selected={isSelected}
            className={cn(
              'relative h-10 w-10 rounded-full border-2 border-gray-300',
              'flex items-center justify-center text-sm font-semibold',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isSelected && 'text-white border-transparent',
              !isSelected && 'hover:border-gray-400',
              getNumberColor(number)
            )}
          >
            {number}
          </button>
        );
      })}
    </div>
  );
};