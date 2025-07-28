import React from 'react';
import { Stack, Text, styled } from 'tamagui';
import { getNumberColor } from '@lottopass/shared';

const BallContainer = styled(Stack, {
  name: 'LottoBall',
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: 'center',
  justifyContent: 'center',
  
  variants: {
    size: {
      small: {
        width: 32,
        height: 32,
        borderRadius: 16,
      },
      medium: {
        width: 40,
        height: 40,
        borderRadius: 20,
      },
      large: {
        width: 48,
        height: 48,
        borderRadius: 24,
      },
    },
    
    isBonus: {
      true: {
        borderWidth: 2,
        borderColor: '$color',
        borderStyle: 'dashed',
      },
    },
    
    isSelected: {
      true: {
        scale: 1.1,
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
      },
    },
  } as const,
  
  defaultVariants: {
    size: 'medium',
  },
});

const BallText = styled(Text, {
  color: 'white',
  fontWeight: '600',
  
  variants: {
    size: {
      small: {
        fontSize: '$3',
      },
      medium: {
        fontSize: '$4',
      },
      large: {
        fontSize: '$5',
      },
    },
  } as const,
});

interface LottoBallProps {
  number: number;
  size?: 'small' | 'medium' | 'large';
  isBonus?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
}

export function LottoBall({ 
  number, 
  size = 'medium', 
  isBonus = false,
  isSelected = false,
  onPress 
}: LottoBallProps) {
  const color = getNumberColor(number);
  
  return (
    <BallContainer
      backgroundColor={color}
      size={size}
      isBonus={isBonus}
      isSelected={isSelected}
      onPress={onPress}
      pressStyle={onPress ? { scale: 0.95 } : undefined}
      animation={onPress ? 'quick' : undefined}
    >
      <BallText size={size}>{number}</BallText>
    </BallContainer>
  );
}