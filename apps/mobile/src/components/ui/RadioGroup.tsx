import React, { createContext, useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { cn } from '../../utils/cn';

interface RadioGroupContextProps {
  value: string;
  onValueChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextProps | undefined>(undefined);

interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function RadioGroup({ value, onValueChange, children, className }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <View className={cn(className)}>{children}</View>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps {
  value: string;
  id: string;
  children: React.ReactNode;
  className?: string;
}

RadioGroup.Item = function RadioGroupItem({ value, id, children, className }: RadioGroupItemProps) {
  const context = useContext(RadioGroupContext);
  if (!context) throw new Error('RadioGroup.Item must be used within RadioGroup');

  const isSelected = context.value === value;

  return (
    <TouchableOpacity
      onPress={() => context.onValueChange(value)}
      className={cn("flex-row items-center gap-2", className)}
    >
      <View className="h-5 w-5 rounded-full border-2 border-gray-300 items-center justify-center">
        {isSelected && <View className="h-3 w-3 rounded-full bg-primary" />}
      </View>
      {children}
    </TouchableOpacity>
  );
};

RadioGroup.Indicator = function RadioGroupIndicator() {
  // Indicator is handled within Item component
  return null;
};