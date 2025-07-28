export * from './primitives';
export * from './components';
export { config } from './theme/config';

// Re-export commonly used Tamagui components
export {
  Stack,
  XStack,
  YStack,
  ZStack,
  ScrollView,
  Sheet,
  Dialog,
  Popover,
  Tooltip,
  Progress,
  Switch,
  Label,
  Separator,
  Spinner,
  Image,
} from 'tamagui';

// Re-export types
export type { TamaguiConfig } from 'tamagui';