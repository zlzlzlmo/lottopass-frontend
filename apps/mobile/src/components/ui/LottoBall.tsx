import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../utils/cn';

interface LottoBallProps {
  number: number;
  size?: 'small' | 'medium' | 'large';
  isBonus?: boolean;
}

export function LottoBall({ number, size = 'medium', isBonus = false }: LottoBallProps) {
  const getBallColor = (num: number) => {
    if (num <= 10) return 'bg-ball-yellow';
    if (num <= 20) return 'bg-ball-blue';
    if (num <= 30) return 'bg-ball-red';
    if (num <= 40) return 'bg-ball-green';
    return 'bg-ball-purple';
  };

  const sizes = {
    small: 'h-8 w-8',
    medium: 'h-10 w-10',
    large: 'h-12 w-12',
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  return (
    <View
      className={cn(
        "rounded-full items-center justify-center shadow-md",
        sizes[size],
        isBonus ? 'bg-ball-gray' : getBallColor(number)
      )}
    >
      <Text
        className={cn(
          "text-white font-bold",
          textSizes[size]
        )}
      >
        {number}
      </Text>
    </View>
  );
}