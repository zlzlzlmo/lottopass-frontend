import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LottoBall } from './lotto-ball';

describe('LottoBall', () => {
  it('renders with number', () => {
    render(<LottoBall number={7} />);
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('applies correct color class based on number range', () => {
    const { rerender, container } = render(<LottoBall number={5} />);
    expect(container.firstChild).toHaveClass('lotto-ball-yellow');

    rerender(<LottoBall number={15} />);
    expect(container.firstChild).toHaveClass('lotto-ball-blue');

    rerender(<LottoBall number={25} />);
    expect(container.firstChild).toHaveClass('lotto-ball-red');

    rerender(<LottoBall number={35} />);
    expect(container.firstChild).toHaveClass('lotto-ball-green');

    rerender(<LottoBall number={45} />);
    expect(container.firstChild).toHaveClass('lotto-ball-purple');
  });

  it('applies correct size class', () => {
    const { rerender, container } = render(<LottoBall number={7} size="sm" />);
    expect(container.firstChild).toHaveClass('h-8', 'w-8', 'text-xs');

    rerender(<LottoBall number={7} size="md" />);
    expect(container.firstChild).toHaveClass('h-10', 'w-10', 'text-sm');

    rerender(<LottoBall number={7} size="lg" />);
    expect(container.firstChild).toHaveClass('h-12', 'w-12', 'text-base');
  });

  it('applies custom className', () => {
    const { container } = render(<LottoBall number={7} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders with default size when size prop is not provided', () => {
    const { container } = render(<LottoBall number={7} />);
    expect(container.firstChild).toHaveClass('h-10', 'w-10', 'text-sm');
  });
});