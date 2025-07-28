import type { LottoDraw } from '../types';

export const LOTTO_NUMBERS = Array.from({ length: 45 }, (_, i) => i + 1);
export const NUMBERS_PER_DRAW = 6;
export const BONUS_NUMBER_COUNT = 1;

export function validateLottoNumbers(numbers: number[]): boolean {
  if (numbers.length !== NUMBERS_PER_DRAW) return false;
  
  const uniqueNumbers = new Set(numbers);
  if (uniqueNumbers.size !== NUMBERS_PER_DRAW) return false;
  
  return numbers.every(num => num >= 1 && num <= 45);
}

export function getNumberColor(number: number): string {
  if (number <= 10) return '#FFC107'; // Yellow
  if (number <= 20) return '#2196F3'; // Blue
  if (number <= 30) return '#F44336'; // Red
  if (number <= 40) return '#4CAF50'; // Green
  return '#9C27B0'; // Purple
}

export function calculatePrize(matchedNumbers: number, hasBonus: boolean): number | null {
  if (matchedNumbers === 6) return 1;
  if (matchedNumbers === 5 && hasBonus) return 2;
  if (matchedNumbers === 5) return 3;
  if (matchedNumbers === 4) return 4;
  if (matchedNumbers === 3) return 5;
  return null;
}

export function formatPrize(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억원`;
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

export function extractNumbersFromDraw(draw: LottoDraw): number[] {
  return [
    draw.drwtNo1,
    draw.drwtNo2,
    draw.drwtNo3,
    draw.drwtNo4,
    draw.drwtNo5,
    draw.drwtNo6
  ];
}

export function calculateSum(numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0);
}

export function getOddEvenCount(numbers: number[]): { odd: number; even: number } {
  const odd = numbers.filter(n => n % 2 === 1).length;
  return { odd, even: numbers.length - odd };
}

export function getHighLowCount(numbers: number[]): { high: number; low: number } {
  const high = numbers.filter(n => n > 22).length;
  return { high, low: numbers.length - high };
}

export function hasConsecutiveNumbers(numbers: number[]): boolean {
  const sorted = [...numbers].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1] - sorted[i] === 1) return true;
  }
  return false;
}