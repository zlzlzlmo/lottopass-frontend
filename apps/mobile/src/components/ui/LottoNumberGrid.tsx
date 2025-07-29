import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { cn } from '../../utils/cn';

interface LottoNumberGridProps {
  selectedNumbers: number[];
  excludedNumbers?: number[];
  onNumberPress: (number: number) => void;
  columns?: number;
}

export function LottoNumberGrid({
  selectedNumbers,
  excludedNumbers = [],
  onNumberPress,
  columns = 7,
}: LottoNumberGridProps) {
  const getBallColor = (num: number) => {
    if (num <= 10) return 'bg-ball-yellow';
    if (num <= 20) return 'bg-ball-blue';
    if (num <= 30) return 'bg-ball-red';
    if (num <= 40) return 'bg-ball-green';
    return 'bg-ball-purple';
  };

  return (
    <View className="flex-row flex-wrap">
      {Array.from({ length: 45 }, (_, i) => i + 1).map((number) => {
        const isSelected = selectedNumbers.includes(number);
        const isExcluded = excludedNumbers.includes(number);
        
        return (
          <TouchableOpacity
            key={number}
            onPress={() => !isExcluded && onNumberPress(number)}
            disabled={isExcluded}
            className="p-1"
            style={{ width: `${100 / columns}%` }}
          >
            <View
              className={cn(
                "h-10 w-10 rounded-full items-center justify-center mx-auto",
                isSelected ? getBallColor(number) : 'bg-gray-100',
                isExcluded && 'opacity-30'
              )}
            >
              <Text
                className={cn(
                  "font-bold text-sm",
                  isSelected ? 'text-white' : 'text-gray-700'
                )}
              >
                {number}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}