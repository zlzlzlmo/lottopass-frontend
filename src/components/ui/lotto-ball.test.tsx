import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LottoBall } from './lotto-ball';

describe('LottoBall', () => {
  it('should render with number', () => {
    render(<LottoBall number={7} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('should apply correct color based on number range', () => {
    const { rerender } = render(<LottoBall number={7} />);
    let ball = screen.getByText('7').parentElement;
    expect(ball).toHaveClass('bg-yellow-500');

    rerender(<LottoBall number={15} />);
    ball = screen.getByText('15').parentElement;
    expect(ball).toHaveClass('bg-blue-500');

    rerender(<LottoBall number={25} />);
    ball = screen.getByText('25').parentElement;
    expect(ball).toHaveClass('bg-red-500');

    rerender(<LottoBall number={35} />);
    ball = screen.getByText('35').parentElement;
    expect(ball).toHaveClass('bg-gray-600');

    rerender(<LottoBall number={45} />);
    ball = screen.getByText('45').parentElement;
    expect(ball).toHaveClass('bg-green-500');
  });

  it('should apply bonus styling when isBonus is true', () => {
    render(<LottoBall number={7} isBonus />);
    const ball = screen.getByText('7').parentElement;
    expect(ball).toHaveClass('ring-2');
    expect(ball).toHaveClass('ring-purple-500');
  });

  it('should apply different sizes', () => {
    const { rerender } = render(<LottoBall number={7} size="sm" />);
    let ball = screen.getByText('7').parentElement;
    expect(ball).toHaveClass('h-8 w-8');

    rerender(<LottoBall number={7} size="lg" />);
    ball = screen.getByText('7').parentElement;
    expect(ball).toHaveClass('h-12 w-12');
  });
});