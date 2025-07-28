import { Stack, styled } from 'tamagui';
import type { GetProps } from 'tamagui';

export const Card = styled(Stack, {
  name: 'Card',
  backgroundColor: '$background',
  borderRadius: '$4',
  padding: '$4',
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3,
  
  variants: {
    variant: {
      elevated: {
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      },
      outlined: {
        borderWidth: 1,
        borderColor: '$borderColor',
        shadowOpacity: 0,
        elevation: 0,
      },
      ghost: {
        backgroundColor: 'transparent',
        shadowOpacity: 0,
        elevation: 0,
        padding: 0,
      },
    },
    
    interactive: {
      true: {
        hoverStyle: {
          scale: 1.01,
          shadowOpacity: 0.2,
          shadowRadius: 10,
        },
        pressStyle: {
          scale: 0.99,
        },
        animation: 'quick',
      },
    },
    
    padded: {
      none: { padding: 0 },
      small: { padding: '$2' },
      medium: { padding: '$4' },
      large: { padding: '$6' },
    },
  } as const,
  
  defaultVariants: {
    padded: 'medium',
  },
});

export const CardHeader = styled(Stack, {
  name: 'CardHeader',
  paddingBottom: '$3',
  borderBottomWidth: 1,
  borderBottomColor: '$borderColorWeak',
  marginBottom: '$3',
});

export const CardContent = styled(Stack, {
  name: 'CardContent',
  flex: 1,
});

export const CardFooter = styled(Stack, {
  name: 'CardFooter',
  paddingTop: '$3',
  borderTopWidth: 1,
  borderTopColor: '$borderColorWeak',
  marginTop: '$3',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: '$2',
});

export type CardProps = GetProps<typeof Card>;