import React from 'react';
import { XStack, YStack, Stack } from 'tamagui';
import { LottoBall } from './LottoBall';
import { LOTTO_NUMBERS } from '@lottopass/shared';

interface LottoNumberGridProps {
  selectedNumbers: number[];
  excludedNumbers?: number[];
  onNumberPress?: (number: number) => void;
  disabled?: boolean;
  columns?: number;
}

export function LottoNumberGrid({
  selectedNumbers,
  excludedNumbers = [],
  onNumberPress,
  disabled = false,
  columns = 7,
}: LottoNumberGridProps) {
  const rows = Math.ceil(LOTTO_NUMBERS.length / columns);
  
  const getNumberStatus = (number: number) => ({
    isSelected: selectedNumbers.includes(number),
    isExcluded: excludedNumbers.includes(number),
  });
  
  return (
    <YStack gap="$2">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <XStack key={rowIndex} gap="$2" justifyContent="center">
          {Array.from({ length: columns }).map((_, colIndex) => {
            const numberIndex = rowIndex * columns + colIndex;
            const number = numberIndex + 1;
            
            if (number > 45) return <Stack key={colIndex} width={40} />;
            
            const { isSelected, isExcluded } = getNumberStatus(number);
            
            return (
              <LottoBall
                key={number}
                number={number}
                size="small"
                isSelected={isSelected}
                onPress={
                  !disabled && !isExcluded && onNumberPress
                    ? () => onNumberPress(number)
                    : undefined
                }
              />
            );
          })}
        </XStack>
      ))}
    </YStack>
  );
}