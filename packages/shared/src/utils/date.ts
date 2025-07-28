import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale('ko');

export function formatDate(date: string | Date, format = 'YYYY.MM.DD'): string {
  return dayjs(date).format(format);
}

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('YYYY.MM.DD HH:mm');
}

export function getRelativeTime(date: string | Date): string {
  return dayjs(date).fromNow();
}

export function getDrawDate(drawNumber: number): Date {
  // 제1회 추첨일: 2002년 12월 7일
  const firstDrawDate = new Date('2002-12-07');
  const weeksSinceFirst = drawNumber - 1;
  const drawDate = new Date(firstDrawDate);
  drawDate.setDate(drawDate.getDate() + weeksSinceFirst * 7);
  return drawDate;
}

export function getCurrentDrawNumber(): number {
  const firstDrawDate = new Date('2002-12-07');
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - firstDrawDate.getTime());
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  return diffWeeks + 1;
}

export function getNextDrawDate(): Date {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + daysUntilSaturday);
  nextSaturday.setHours(20, 45, 0, 0); // 추첨 시간: 오후 8시 45분
  return nextSaturday;
}

export function formatTimeUntilDraw(): string {
  const nextDraw = getNextDrawDate();
  const now = new Date();
  const diff = nextDraw.getTime() - now.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}일 ${hours}시간 남음`;
  if (hours > 0) return `${hours}시간 ${minutes}분 남음`;
  return `${minutes}분 남음`;
}