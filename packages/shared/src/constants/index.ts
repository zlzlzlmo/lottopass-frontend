// API URL은 이제 상대 경로 사용 (Next.js API Routes)
export const API_BASE_URL = '';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  NUMBER_GENERATION: '/number-generation',
  STATISTICS: '/statistics',
  WINNING_STORES: '/winning-stores',
  HISTORY: '/history',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const QUERY_KEYS = {
  LATEST_DRAW: 'latestDraw',
  ALL_DRAWS: 'allDraws',
  DRAW_DETAIL: 'drawDetail',
  STORES: 'stores',
  WINNING_STORES: 'winningStores',
  USER_PROFILE: 'userProfile',
  SAVED_COMBINATIONS: 'savedCombinations',
  STATISTICS: 'statistics',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_PREFERENCES: 'userPreferences',
  RECENT_NUMBERS: 'recentNumbers',
  THEME: 'theme',
} as const;

export const COLORS = {
  primary: '#1677ff',
  secondary: '#52c41a',
  danger: '#ff4d4f',
  warning: '#faad14',
  info: '#1890ff',
  
  ball: {
    yellow: '#FFC107',
    blue: '#2196F3',
    red: '#F44336',
    green: '#4CAF50',
    purple: '#9C27B0',
  },
  
  background: {
    light: '#ffffff',
    dark: '#000000',
  },
  
  text: {
    primary: '#262626',
    secondary: '#8c8c8c',
    disabled: '#bfbfbf',
  },
} as const;

export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;