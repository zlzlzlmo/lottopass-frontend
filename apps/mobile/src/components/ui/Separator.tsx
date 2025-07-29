import React from 'react';
import { View } from 'react-native';
import { cn } from '../../utils/cn';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Separator({ orientation = 'horizontal', className }: SeparatorProps) {
  return (
    <View
      className={cn(
        orientation === 'horizontal' ? 'h-[1px] w-full bg-gray-200' : 'w-[1px] h-full bg-gray-200',
        className
      )}
    />
  );
}