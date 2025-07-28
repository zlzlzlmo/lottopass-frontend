import { createTamagui } from 'tamagui';
import { shorthands } from '@tamagui/shorthands';
import { themes, tokens } from '@tamagui/themes';
import { createInterFont } from '@tamagui/font-inter';
import { createAnimations } from '@tamagui/animations-react-native';
import { createMedia } from '@tamagui/react-native-media-driver';

const animations = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
});

const headingFont = createInterFont({
  family: 'Inter',
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 40,
    10: 48,
  },
  weight: {
    1: '400',
    2: '500',
    3: '600',
    4: '700',
    5: '800',
    6: '900',
  },
});

const bodyFont = createInterFont({
  family: 'Inter',
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 24,
    9: 28,
    10: 32,
  },
  weight: {
    1: '300',
    2: '400',
    3: '500',
    4: '600',
    5: '700',
  },
});

export const config = createTamagui({
  animations,
  defaultTheme: 'light',
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes: {
    ...themes,
    light: {
      ...themes.light,
      primary: '#1677ff',
      secondary: '#52c41a',
      danger: '#ff4d4f',
      warning: '#faad14',
      info: '#1890ff',
      
      ballYellow: '#FFC107',
      ballBlue: '#2196F3',
      ballRed: '#F44336',
      ballGreen: '#4CAF50',
      ballPurple: '#9C27B0',
    },
    dark: {
      ...themes.dark,
      primary: '#1677ff',
      secondary: '#52c41a',
      danger: '#ff4d4f',
      warning: '#faad14',
      info: '#1890ff',
      
      ballYellow: '#FFC107',
      ballBlue: '#2196F3',
      ballRed: '#F44336',
      ballGreen: '#4CAF50',
      ballPurple: '#9C27B0',
    },
  },
  tokens: {
    ...tokens,
    color: {
      ...tokens.color,
      primary: '#1677ff',
      secondary: '#52c41a',
      danger: '#ff4d4f',
      warning: '#faad14',
      info: '#1890ff',
    },
  },
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
});