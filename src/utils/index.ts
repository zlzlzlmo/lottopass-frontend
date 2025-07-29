export * from './ballColor';
export * from './distance';
export * from './error';
export * from './group';
export * from './lazyWithRetry';
export * from './map';
export * from './number';
export * from './storage';

// Date formatting
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Prize formatting
export const formatPrize = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Time until draw formatting
export const formatTimeUntilDraw = (): string => {
  const now = new Date();
  const nextSaturday = new Date();
  
  // Set to next Saturday 8:35 PM
  nextSaturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7 || 7));
  nextSaturday.setHours(20, 35, 0, 0);
  
  // If we've passed this week's draw time, go to next week
  if (now > nextSaturday) {
    nextSaturday.setDate(nextSaturday.getDate() + 7);
  }
  
  const diff = nextSaturday.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}일 ${hours}시간 ${minutes}분`;
  } else if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  } else {
    return `${minutes}분`;
  }
};