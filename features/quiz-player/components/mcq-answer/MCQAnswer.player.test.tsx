import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { MCQAnswer } from './MCQAnswer.player';

describe('MCQAnswer', () => {
  const mockOptions = ['Option A', 'Option B', 'Option C', 'Option D'];

  it('renders all options', () => {
    const mockOnChange = vi.fn();

    render(<MCQAnswer options={mockOptions} selectedValue="" onChange={mockOnChange} />);

    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
    expect(screen.getByText('Option D')).toBeInTheDocument();
  });

  it('calls onChange when option is clicked', () => {
    const mockOnChange = vi.fn();

    render(<MCQAnswer options={mockOptions} selectedValue="" onChange={mockOnChange} />);

    const optionButton = screen.getByText('Option B').closest('button');
    fireEvent.click(optionButton!);

    expect(mockOnChange).toHaveBeenCalledWith('1');
  });

  it('highlights selected option', () => {
    const mockOnChange = vi.fn();

    render(<MCQAnswer options={mockOptions} selectedValue="1" onChange={mockOnChange} />);

    const selectedButton = screen.getByText('Option B').closest('button');
    expect(selectedButton).toHaveClass('border-brand');
  });

  it('shows filled radio button for selected option', () => {
    const mockOnChange = vi.fn();

    const { container } = render(
      <MCQAnswer options={mockOptions} selectedValue="2" onChange={mockOnChange} />,
    );

    const radioButtons = container.querySelectorAll('.bg-brand');
    expect(radioButtons.length).toBeGreaterThan(0);
  });

  it('disables all options when disabled prop is true', () => {
    const mockOnChange = vi.fn();

    render(<MCQAnswer options={mockOptions} selectedValue="0" onChange={mockOnChange} disabled />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('does not call onChange when disabled option is clicked', () => {
    const mockOnChange = vi.fn();

    render(<MCQAnswer options={mockOptions} selectedValue="" onChange={mockOnChange} disabled />);

    const optionButton = screen.getByText('Option A').closest('button');
    fireEvent.click(optionButton!);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('renders with two options (true/false)', () => {
    const mockOnChange = vi.fn();
    const booleanOptions = ['True', 'False'];

    render(<MCQAnswer options={booleanOptions} selectedValue="0" onChange={mockOnChange} />);

    expect(screen.getByText('True')).toBeInTheDocument();
    expect(screen.getByText('False')).toBeInTheDocument();
  });

  it('handles option index correctly for many options', () => {
    const mockOnChange = vi.fn();
    const manyOptions = ['A', 'B', 'C', 'D', 'E', 'F'];

    render(<MCQAnswer options={manyOptions} selectedValue="" onChange={mockOnChange} />);

    const lastOption = screen.getByText('F').closest('button');
    fireEvent.click(lastOption!);

    expect(mockOnChange).toHaveBeenCalledWith('5');
  });
});
