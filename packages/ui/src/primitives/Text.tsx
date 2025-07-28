import { Text as TamaguiText, styled } from 'tamagui';
import type { GetProps } from 'tamagui';

export const Text = styled(TamaguiText, {
  name: 'Text',
  fontFamily: '$body',
  color: '$color',
  
  variants: {
    variant: {
      body: {
        fontSize: '$4',
        lineHeight: '$4',
      },
      caption: {
        fontSize: '$2',
        lineHeight: '$2',
        color: '$colorSubtle',
      },
      label: {
        fontSize: '$3',
        lineHeight: '$3',
        fontWeight: '500',
      },
    },
    
    color: {
      primary: { color: '$primary' },
      secondary: { color: '$secondary' },
      danger: { color: '$danger' },
      warning: { color: '$warning' },
      info: { color: '$info' },
      muted: { color: '$colorSubtle' },
    },
    
    weight: {
      normal: { fontWeight: '400' },
      medium: { fontWeight: '500' },
      semibold: { fontWeight: '600' },
      bold: { fontWeight: '700' },
    },
    
    align: {
      left: { textAlign: 'left' },
      center: { textAlign: 'center' },
      right: { textAlign: 'right' },
    },
  } as const,
  
  defaultVariants: {
    variant: 'body',
    weight: 'normal',
  },
});

export const Heading = styled(Text, {
  name: 'Heading',
  fontFamily: '$heading',
  fontWeight: '600',
  
  variants: {
    level: {
      1: {
        fontSize: '$9',
        lineHeight: '$9',
        fontWeight: '700',
      },
      2: {
        fontSize: '$8',
        lineHeight: '$8',
        fontWeight: '600',
      },
      3: {
        fontSize: '$7',
        lineHeight: '$7',
        fontWeight: '600',
      },
      4: {
        fontSize: '$6',
        lineHeight: '$6',
        fontWeight: '500',
      },
      5: {
        fontSize: '$5',
        lineHeight: '$5',
        fontWeight: '500',
      },
      6: {
        fontSize: '$4',
        lineHeight: '$4',
        fontWeight: '500',
      },
    },
  } as const,
  
  defaultVariants: {
    level: 3,
  },
});

export type TextProps = GetProps<typeof Text>;
export type HeadingProps = GetProps<typeof Heading>;