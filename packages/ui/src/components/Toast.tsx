import React from 'react';
import { Toast as TamaguiToast, useToastController, useToastState, ToastViewport } from '@tamagui/toast';
import { YStack, XStack } from 'tamagui';
import { Text } from '../primitives/Text';
import { Button } from '../primitives/Button';

export { ToastViewport };

interface ToastProps {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function Toast({ 
  id, 
  title, 
  message, 
  type = 'info',
  action 
}: ToastProps) {
  const toast = useToastController();
  
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: '$secondary', borderColor: '$secondary' };
      case 'error':
        return { backgroundColor: '$danger', borderColor: '$danger' };
      case 'warning':
        return { backgroundColor: '$warning', borderColor: '$warning' };
      default:
        return { backgroundColor: '$info', borderColor: '$info' };
    }
  };
  
  return (
    <TamaguiToast
      key={id}
      duration={5000}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="quick"
      viewportName="default"
    >
      <YStack
        {...getTypeStyles()}
        paddingHorizontal="$4"
        paddingVertical="$3"
        borderRadius="$4"
        minWidth={300}
        maxWidth={500}
        opacity={0.95}
      >
        <TamaguiToast.Title>
          <Text weight="semibold">
            {title}
          </Text>
        </TamaguiToast.Title>
        
        {message && (
          <TamaguiToast.Description>
            <Text variant="caption">
              {message}
            </Text>
          </TamaguiToast.Description>
        )}
        
        {action && (
          <XStack marginTop="$2" gap="$2">
            <TamaguiToast.Action asChild altText={action.label}>
              <Button
                size="small"
                variant="ghost"
                onPress={action.onPress}
              >
                {action.label}
              </Button>
            </TamaguiToast.Action>
          </XStack>
        )}
        
        <TamaguiToast.Close asChild>
          <Button
            size="small"
            variant="ghost"
            position="absolute"
            top="$1"
            right="$1"
            circular
            icon={"X" as any}
          />
        </TamaguiToast.Close>
      </YStack>
    </TamaguiToast>
  );
}

// Hook for showing toasts
export function useToast() {
  const toast = useToastController();
  
  const show = (props: Omit<ToastProps, 'id'>) => {
    const id = `toast-${Date.now()}`;
    toast.show(id, {
      ...props,
      id,
    });
  };
  
  return {
    show,
    hide: toast.hide,
  };
}