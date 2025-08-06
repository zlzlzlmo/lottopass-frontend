import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NumberSelector } from './NumberSelector';

describe('NumberSelector', () => {
  const defaultProps = {
    selectedNumbers: [],
    onNumbersChange: vi.fn(),
    maxNumbers: 6,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all 45 lottery numbers', () => {
    render(<NumberSelector {...defaultProps} />);
    
    for (let i = 1; i <= 45; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it('calls onNumbersChange when a number is clicked', () => {
    render(<NumberSelector {...defaultProps} />);
    
    const number7 = screen.getByText('7');
    fireEvent.click(number7);
    
    expect(defaultProps.onNumbersChange).toHaveBeenCalledWith([7]);
  });

  it('shows selected numbers with different styling', () => {
    render(<NumberSelector {...defaultProps} selectedNumbers={[7, 14, 21]} />);
    
    const number7 = screen.getByText('7');
    const number8 = screen.getByText('8');
    
    expect(number7.parentElement).toHaveAttribute('data-selected', 'true');
    expect(number8.parentElement).not.toHaveAttribute('data-selected', 'true');
  });

  it('disables unselected numbers when max is reached', () => {
    render(
      <NumberSelector 
        {...defaultProps} 
        selectedNumbers={[1, 2, 3, 4, 5, 6]} 
      />
    );
    
    const number7 = screen.getByText('7');
    expect(number7.parentElement).toBeDisabled();
    
    const number1 = screen.getByText('1');
    expect(number1.parentElement).not.toBeDisabled();
  });

  it('deselects a number when clicked again', () => {
    render(
      <NumberSelector 
        {...defaultProps} 
        selectedNumbers={[7, 14]} 
      />
    );
    
    const number7 = screen.getByText('7');
    fireEvent.click(number7);
    
    expect(defaultProps.onNumbersChange).toHaveBeenCalledWith([14]);
  });

  it('prevents selecting more than maxNumbers', () => {
    render(
      <NumberSelector 
        {...defaultProps} 
        selectedNumbers={[1, 2, 3, 4, 5, 6]} 
      />
    );
    
    const number7 = screen.getByText('7');
    fireEvent.click(number7);
    
    expect(defaultProps.onNumbersChange).not.toHaveBeenCalled();
  });

  it('displays helper text when provided', () => {
    render(
      <NumberSelector 
        {...defaultProps} 
        helperText="6개의 번호를 선택하세요" 
      />
    );
    
    expect(screen.getByText('6개의 번호를 선택하세요')).toBeInTheDocument();
  });

  it('respects min and max number props', () => {
    render(
      <NumberSelector 
        {...defaultProps} 
        minNumber={10}
        maxNumber={20}
      />
    );
    
    // 10-20 범위의 숫자만 표시되는지 확인
    expect(screen.queryByText('9')).not.toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.queryByText('21')).not.toBeInTheDocument();
  });
});