import { Button as TamaguiButton, styled } from 'tamagui';
import type { GetProps } from 'tamagui';

export const Button = styled(TamaguiButton, {
  name: 'Button',
  
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: 'white',
        hoverStyle: {
          backgroundColor: '$primaryHover',
        },
        pressStyle: {
          backgroundColor: '$primaryPress',
        },
      },
      secondary: {
        backgroundColor: '$secondary',
        color: 'white',
        hoverStyle: {
          backgroundColor: '$secondaryHover',
        },
        pressStyle: {
          backgroundColor: '$secondaryPress',
        },
      },
      danger: {
        backgroundColor: '$danger',
        color: 'white',
        hoverStyle: {
          backgroundColor: '$dangerHover',
        },
        pressStyle: {
          backgroundColor: '$dangerPress',
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$borderColor',
        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },
        pressStyle: {
          backgroundColor: '$backgroundPress',
        },
      },
      link: {
        backgroundColor: 'transparent',
        color: '$primary',
        hoverStyle: {
          textDecorationLine: 'underline',
        },
      },
    },
    
    size: {
      small: {
        paddingHorizontal: '$3',
        paddingVertical: '$2',
        fontSize: '$3',
        height: 32,
      },
      medium: {
        paddingHorizontal: '$4',
        paddingVertical: '$3',
        fontSize: '$4',
        height: 40,
      },
      large: {
        paddingHorizontal: '$5',
        paddingVertical: '$4',
        fontSize: '$5',
        height: 48,
      },
    },
    
    fullWidth: {
      true: {
        width: '100%',
      },
    },
    
    rounded: {
      true: {
        borderRadius: 9999,
      },
    },
  } as const,
  
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

export type ButtonProps = GetProps<typeof Button>;