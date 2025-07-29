// New Zustand stores
export { useAuthStore } from './auth.store';
export { useLotteryStore } from './lottery.store';
export { useUserStore } from './user.store';
export { useUIStore } from './ui.store';

// Legacy stores (to be migrated)
export { useAuthStore as useAuthStore_legacy } from './authStore';
export { useLottoStore } from './lottoStore';
export { useUIStore as useUIStore_legacy } from './uiStore';

// Legacy types
export type { AuthStore } from './authStore';
export type { LottoStore } from './lottoStore';
export type { UIStore } from './uiStore';