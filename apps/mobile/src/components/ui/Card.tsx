import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
}

export function Card({ children, className, onPress }: CardProps) {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component 
      onPress={onPress}
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200",
        className
      )}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={cn("px-4 py-3 border-b border-gray-100", className)}>
      {children}
    </View>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={cn("p-4", className)}>
      {children}
    </View>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Text className={cn("text-lg font-semibold text-gray-900", className)}>
      {children}
    </Text>
  );
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Text className={cn("text-sm text-gray-600 mt-1", className)}>
      {children}
    </Text>
  );
}