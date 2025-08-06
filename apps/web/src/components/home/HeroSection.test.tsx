import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroSection } from './HeroSection';

// Next.js router 모킹
const mockPush = vi.fn();
const mockReplace = vi.fn();
const mockPrefetch = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: mockPrefetch,
  }),
}));

describe('HeroSection', () => {
  it('renders hero title and subtitle', () => {
    render(<HeroSection />);
    
    expect(screen.getByText('로또 당첨의 꿈,')).toBeInTheDocument();
    expect(screen.getByText('데이터로 현실로')).toBeInTheDocument();
    expect(screen.getByText(/AI 기반 번호 분석부터 당첨 통계까지/)).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<HeroSection />);
    
    const startButton = screen.getByRole('button', { name: /무료로 시작하기/ });
    const analyzeButton = screen.getByRole('button', { name: /번호 분석하기/ });
    
    expect(startButton).toBeInTheDocument();
    expect(analyzeButton).toBeInTheDocument();
  });

  it('renders feature badges', () => {
    render(<HeroSection />);
    
    expect(screen.getByText('AI 번호 추천')).toBeInTheDocument();
    expect(screen.getByText('실시간 당첨 확인')).toBeInTheDocument();
    expect(screen.getByText('통계 분석')).toBeInTheDocument();
  });

  it('renders lottery balls animation', () => {
    render(<HeroSection />);
    
    // 로또 볼들이 렌더링되는지 확인
    const lottoBalls = screen.getAllByText(/\d+/);
    expect(lottoBalls.length).toBeGreaterThan(0);
  });

  it('handles CTA button clicks', () => {
    render(<HeroSection />);
    
    const startButton = screen.getByRole('button', { name: /무료로 시작하기/ });
    fireEvent.click(startButton);
    
    expect(mockPush).toHaveBeenCalledWith('/signup');
  });
});