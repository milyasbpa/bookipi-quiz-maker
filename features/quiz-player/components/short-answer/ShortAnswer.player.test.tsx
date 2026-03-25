import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ShortAnswer } from './ShortAnswer.player';

describe('ShortAnswer', () => {
  it('renders textarea with value', () => {
    const mockOnChange = vi.fn();

    render(<ShortAnswer value="Test answer" onChange={mockOnChange} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('Test answer');
  });

  it('renders placeholder when provided', () => {
    const mockOnChange = vi.fn();

    render(<ShortAnswer value="" onChange={mockOnChange} placeholder="Enter your answer..." />);

    expect(screen.getByPlaceholderText('Enter your answer...')).toBeInTheDocument();
  });

  it('calls onChange when text is typed', () => {
    const mockOnChange = vi.fn();

    render(<ShortAnswer value="" onChange={mockOnChange} />);

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New answer' } });

    expect(mockOnChange).toHaveBeenCalledWith('New answer');
  });

  it('handles empty value', () => {
    const mockOnChange = vi.fn();

    render(<ShortAnswer value="" onChange={mockOnChange} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('');
  });

  it('handles multiline text', () => {
    const mockOnChange = vi.fn();
    const multilineText = 'Line 1\nLine 2\nLine 3';

    render(<ShortAnswer value={multilineText} onChange={mockOnChange} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(multilineText);
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnChange = vi.fn();

    render(<ShortAnswer value="Test" onChange={mockOnChange} disabled />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
  });

  it('has correct number of rows', () => {
    const mockOnChange = vi.fn();

    render(<ShortAnswer value="" onChange={mockOnChange} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '4');
  });

  it('applies correct CSS classes', () => {
    const mockOnChange = vi.fn();

    const { container } = render(<ShortAnswer value="" onChange={mockOnChange} />);

    const textarea = container.querySelector('textarea');
    expect(textarea).toHaveClass('w-full');
    expect(textarea).toHaveClass('rounded-xl');
  });
});
