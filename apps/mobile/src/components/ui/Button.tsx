import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { cn } from '../../utils/cn';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className,
}: ButtonProps) {
  const variants = {
    primary: "bg-primary active:bg-primary-600",
    secondary: "bg-secondary active:bg-secondary-600",
    ghost: "bg-transparent active:bg-gray-100",
    outline: "bg-transparent border border-gray-300 active:bg-gray-100",
  };

  const sizes = {
    small: "px-3 py-2",
    medium: "px-4 py-3",
    large: "px-6 py-4",
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const textColors = {
    primary: "text-white",
    secondary: "text-white",
    ghost: "text-gray-900",
    outline: "text-gray-900",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        "rounded-lg items-center justify-center",
        variants[variant],
        sizes[size],
        disabled && "opacity-50",
        className
      )}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'ghost' || variant === 'outline' ? '#374151' : 'white'} 
          size="small" 
        />
      ) : (
        <Text
          className={cn(
            "font-medium text-center",
            textSizes[size],
            textColors[variant]
          )}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}