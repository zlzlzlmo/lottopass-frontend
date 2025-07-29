import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LottoBall } from './lotto-ball';

describe('LottoBall', () => {
  describe('렌더링', () => {
    it('번호를 올바르게 표시한다', () => {
      render(<LottoBall number={7} />);
      expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('보너스 볼에 + 표시를 보여준다', () => {
      render(<LottoBall number={45} isBonus />);
      expect(screen.getByText('+')).toBeInTheDocument();
    });

    it('일반 볼에는 + 표시를 보여주지 않는다', () => {
      render(<LottoBall number={10} />);
      expect(screen.queryByText('+')).not.toBeInTheDocument();
    });
  });

  describe('색상 분류', () => {
    it.each([
      [5, 'lotto-ball-yellow'],
      [10, 'lotto-ball-yellow'],
      [11, 'lotto-ball-blue'],
      [20, 'lotto-ball-blue'],
      [21, 'lotto-ball-red'],
      [30, 'lotto-ball-red'],
      [31, 'lotto-ball-green'],
      [40, 'lotto-ball-green'],
      [41, 'lotto-ball-purple'],
      [45, 'lotto-ball-purple'],
    ])('번호 %i는 %s 클래스를 가진다', (number, expectedClass) => {
      const { container } = render(<LottoBall number={number} />);
      const ball = container.querySelector('.lotto-ball');
      expect(ball).toHaveClass(expectedClass);
    });

    it('보너스 볼은 회색 클래스를 가진다', () => {
      const { container } = render(<LottoBall number={7} isBonus />);
      const ball = container.querySelector('.lotto-ball');
      expect(ball).toHaveClass('lotto-ball-gray');
    });
  });

  describe('크기 옵션', () => {
    it.each([
      ['sm' as const, 'lotto-ball-sm'],
      ['md' as const, 'lotto-ball-md'],
      ['lg' as const, 'lotto-ball-lg'],
    ])('size=%s일 때 %s 클래스를 가진다', (size, expectedClass) => {
      const { container } = render(<LottoBall number={1} size={size} />);
      const ball = container.querySelector('.lotto-ball');
      expect(ball).toHaveClass(expectedClass);
    });

    it('기본 크기는 md이다', () => {
      const { container } = render(<LottoBall number={1} />);
      const ball = container.querySelector('.lotto-ball');
      expect(ball).toHaveClass('lotto-ball-md');
    });
  });

  describe('커스텀 클래스', () => {
    it('커스텀 className이 적용된다', () => {
      const { container } = render(<LottoBall number={1} className="custom-class" />);
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('유효성 검증', () => {
    it('1-45 범위의 번호를 렌더링한다', () => {
      const validNumbers = [1, 10, 20, 30, 40, 45];
      validNumbers.forEach(num => {
        render(<LottoBall number={num} />);
        expect(screen.getByText(num.toString())).toBeInTheDocument();
      });
    });
  });
});