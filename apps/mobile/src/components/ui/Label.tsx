import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { cn } from '../../utils/cn';

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  onPress?: () => void;
}

export function Label({ children, htmlFor, className, onPress }: LabelProps) {
  const Component = onPress ? TouchableOpacity : Text;
  
  return (
    <Component
      onPress={onPress}
      className={cn(
        "text-sm font-medium text-gray-700",
        className
      )}
    >
      {children}
    </Component>
  );
}