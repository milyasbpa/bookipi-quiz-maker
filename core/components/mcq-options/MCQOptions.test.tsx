import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { MCQOptions } from './MCQOptions';

describe('MCQOptions', () => {
  const defaultProps = {
    options: ['Option 1', 'Option 2'],
    onChange: vi.fn(),
    onSelectCorrect: vi.fn(),
    addOptionButtonLabel: 'Add Option',
    optionPlaceholder: 'Enter option',
    selectCorrectHint: 'Select the correct answer',
  };

  it('renders all options', () => {
    render(<MCQOptions {...defaultProps} />);
    expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Option 2')).toBeInTheDocument();
  });

  it('renders add option button', () => {
    render(<MCQOptions {...defaultProps} />);
    expect(screen.getByRole('button', { name: /add option/i })).toBeInTheDocument();
  });

  it('renders hint text', () => {
    render(<MCQOptions {...defaultProps} />);
    expect(screen.getByText('Select the correct answer')).toBeInTheDocument();
  });

  it('calls onChange when option text changes', async () => {
    const onChange = vi.fn();
    render(<MCQOptions {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByDisplayValue('Option 1');
    await userEvent.clear(input);
    await userEvent.type(input, 'New Option');
    
    expect(onChange).toHaveBeenCalled();
  });

  it('calls onSelectCorrect when radio button clicked', async () => {
    const onSelectCorrect = vi.fn();
    render(<MCQOptions {...defaultProps} onSelectCorrect={onSelectCorrect} />);
    
    const radios = screen.getAllByRole('radio');
    await userEvent.click(radios[1]);
    
    expect(onSelectCorrect).toHaveBeenCalledWith(1);
  });

  it('shows selected radio button based on selectedCorrectIndex', () => {
    render(<MCQOptions {...defaultProps} selectedCorrectIndex={1} />);
    
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios[0].checked).toBe(false);
    expect(radios[1].checked).toBe(true);
  });

  it('calls onChange with new option when add button clicked', async () => {
    const onChange = vi.fn();
    render(<MCQOptions {...defaultProps} onChange={onChange} />);
    
    const addButton = screen.getByRole('button', { name: /add option/i });
    await userEvent.click(addButton);
    
    expect(onChange).toHaveBeenCalledWith(expect.any(Function));
  });

  it('disables add button when max options (6) reached', () => {
    const sixOptions = ['A', 'B', 'C', 'D', 'E', 'F'];
    render(<MCQOptions {...defaultProps} options={sixOptions} />);
    
    const addButton = screen.getByRole('button', { name: /add option/i });
    expect(addButton).toBeDisabled();
  });

  it('calls onChange when delete button clicked', async () => {
    const onChange = vi.fn();
    render(
      <MCQOptions
        {...defaultProps}
        options={['A', 'B', 'C']}
        onChange={onChange}
      />,
    );
    
    const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
      btn.querySelector('svg')
    );
    await userEvent.click(deleteButtons[0]);
    
    expect(onChange).toHaveBeenCalled();
  });

  it('disables delete button when only one option remains', () => {
    render(<MCQOptions {...defaultProps} options={['Only Option']} />);
    
    const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
      btn.querySelector('svg')
    );
    expect(deleteButtons[0]).toBeDisabled();
  });

  it('disables all controls when disabled prop is true', () => {
    render(<MCQOptions {...defaultProps} disabled={true} />);
    
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[];
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    const addButton = screen.getByRole('button', { name: /add option/i });
    
    inputs.forEach(input => expect(input).toBeDisabled());
    radios.forEach(radio => expect(radio).toBeDisabled());
    expect(addButton).toBeDisabled();
  });

  it('renders option inputs with placeholder', () => {
    render(<MCQOptions {...defaultProps} options={['', '']} />);
    
    const inputs = screen.getAllByPlaceholderText('Enter option');
    expect(inputs).toHaveLength(2);
  });

  it('renders correct number of radio buttons', () => {
    render(<MCQOptions {...defaultProps} options={['A', 'B', 'C', 'D']} />);
    
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(4);
  });

  it('adjusts correct answer when deleting selected option', async () => {
    const onSelectCorrect = vi.fn();
    const onChange = vi.fn((callback) => {
      if (typeof callback === 'function') {
        callback(['A', 'B', 'C']);
      }
    });
    
    render(
      <MCQOptions
        {...defaultProps}
        options={['A', 'B', 'C']}
        selectedCorrectIndex={1}
        onChange={onChange}
        onSelectCorrect={onSelectCorrect}
      />,
    );
    
    const deleteButtons = screen.getAllByRole('button', { name: '' }).filter(btn => 
      btn.querySelector('svg')
    );
    await userEvent.click(deleteButtons[1]);
    
    expect(onSelectCorrect).toHaveBeenCalledWith(0);
  });

  it('enables add button when less than 6 options', () => {
    render(<MCQOptions {...defaultProps} options={['A', 'B', 'C']} />);
    
    const addButton = screen.getByRole('button', { name: /add option/i });
    expect(addButton).not.toBeDisabled();
  });
});
