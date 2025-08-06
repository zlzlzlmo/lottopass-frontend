// 주요 Zustand 스토어 (Barrel exports 최적화)
export { useAuthStore } from './auth.store';
export { useLotteryStore } from './lottery.store';
export { useUserStore } from './user.store';
export { useUIStore } from './ui.store';
export { useDrawStore } from './draw.store';
export { useLocationStore } from './location.store';

// Legacy 스토어 (마이그레이션 진행 중)
// TODO: 이 exports들은 모든 참조가 새 스토어로 업데이트된 후 제거 예정
export { useAuthStore as useAuthStore_legacy } from './authStore';
export { useLottoStore } from './lottoStore';
export { useUIStore as useUIStore_legacy } from './uiStore';

// 타입 exports (필요한 경우에만 import할 수 있도록 분리)
export type { AuthStore } from './authStore';
export type { LottoStore } from './lottoStore';
export type { UIStore } from './uiStore';