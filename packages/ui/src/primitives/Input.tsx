import { Input as TamaguiInput, styled } from 'tamagui';
import type { GetProps } from 'tamagui';

export const Input = styled(TamaguiInput, {
  name: 'Input',
  backgroundColor: '$background',
  borderWidth: 1,
  borderColor: '$borderColor',
  borderRadius: '$2',
  paddingHorizontal: '$3',
  fontSize: '$4',
  color: '$color',
  placeholderTextColor: '$colorPlaceholder',
  
  focusStyle: {
    borderColor: '$primary',
    outlineStyle: 'none',
  },
  
  variants: {
    size: {
      small: {
        paddingVertical: '$2',
        fontSize: '$3',
        height: 32,
      },
      medium: {
        paddingVertical: '$3',
        fontSize: '$4',
        height: 40,
      },
      large: {
        paddingVertical: '$4',
        fontSize: '$5',
        height: 48,
      },
    },
    
    variant: {
      default: {
        backgroundColor: '$background',
      },
      filled: {
        backgroundColor: '$backgroundPress',
        borderWidth: 0,
      },
      flushed: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderBottomWidth: 1,
        borderRadius: 0,
        paddingHorizontal: 0,
      },
    },
    
    status: {
      error: {
        borderColor: '$danger',
        focusStyle: {
          borderColor: '$danger',
        },
      },
      success: {
        borderColor: '$secondary',
        focusStyle: {
          borderColor: '$secondary',
        },
      },
    },
    
    fullWidth: {
      true: {
        width: '100%',
      },
    },
  } as const,
  
  defaultVariants: {
    size: 'medium',
    variant: 'default',
  },
});

export type InputProps = GetProps<typeof Input>;