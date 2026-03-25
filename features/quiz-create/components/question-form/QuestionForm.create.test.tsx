import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { QuestionForm } from './QuestionForm.create';

const defaultProps = {
  onAdd: vi.fn(),
  addQuestionTitle: 'Add Question',
  questionTypeLabel: 'Question Type',
  multipleChoiceLabel: 'Multiple Choice',
  shortAnswerLabel: 'Short Answer',
  questionPromptLabel: 'Question Prompt',
  enterQuestionPlaceholder: 'Enter your question...',
  optionsLabel: 'Options',
  correctAnswerLabel: 'Correct Answer',
  correctAnswerPlaceholder: 'Enter correct answer...',
  addOptionButton: 'Add Option',
  optionPlaceholder: 'Option',
  selectCorrectHint: 'Select the correct option',
  addQuestionButton: 'Add Question',
};

describe('QuestionForm', () => {
  it('renders with all required elements', () => {
    render(<QuestionForm {...defaultProps} />);

    expect(screen.getByText('Add Question')).toBeInTheDocument();
    expect(screen.getByText('Question Type')).toBeInTheDocument();
    expect(screen.getByText('Multiple Choice')).toBeInTheDocument();
    expect(screen.getByText('Short Answer')).toBeInTheDocument();
  });

  it('renders MCQ form by default', () => {
    render(<QuestionForm {...defaultProps} />);

    expect(screen.getByPlaceholderText('Enter your question...')).toBeInTheDocument();
    expect(screen.getByText('Options')).toBeInTheDocument();
  });

  it('switches to short answer mode', () => {
    render(<QuestionForm {...defaultProps} />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'short' } });

    expect(screen.getByText('Correct Answer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter correct answer...')).toBeInTheDocument();
  });

  it('calls onAdd with MCQ question data', () => {
    const onAdd = vi.fn();
    const { container } = render(<QuestionForm {...defaultProps} onAdd={onAdd} />);

    const promptInput = screen.getByPlaceholderText('Enter your question...');
    fireEvent.change(promptInput, { target: { value: 'What is 2+2?' } });

    const optionInputs = screen.getAllByPlaceholderText('Option');
    fireEvent.change(optionInputs[0], { target: { value: '3' } });
    fireEvent.change(optionInputs[1], { target: { value: '4' } });

    const radioInputs = screen.getAllByRole('radio');
    fireEvent.click(radioInputs[1]);

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'mcq',
        prompt: 'What is 2+2?',
        options: expect.arrayContaining(['3', '4']),
      })
    );
  });

  it('calls onAdd with short answer question data', () => {
    const onAdd = vi.fn();
    const { container } = render(<QuestionForm {...defaultProps} onAdd={onAdd} />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'short' } });

    const promptInput = screen.getByPlaceholderText('Enter your question...');
    fireEvent.change(promptInput, { target: { value: 'What is 2+2?' } });

    const answerInput = screen.getByPlaceholderText('Enter correct answer...');
    fireEvent.change(answerInput, { target: { value: '4' } });

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    expect(onAdd).toHaveBeenCalledWith({
      type: 'short',
      prompt: 'What is 2+2?',
      correctAnswer: '4',
    });
  });

  it('does not submit if prompt is empty', () => {
    const onAdd = vi.fn();
    render(<QuestionForm {...defaultProps} onAdd={onAdd} />);

    const submitButton = screen.getByText('Add Question');
    fireEvent.click(submitButton);

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('does not submit MCQ with less than 2 options', () => {
    const onAdd = vi.fn();
    render(<QuestionForm {...defaultProps} onAdd={onAdd} />);

    const promptInput = screen.getByPlaceholderText('Enter your question...');
    fireEvent.change(promptInput, { target: { value: 'Test question?' } });

    const optionInputs = screen.getAllByPlaceholderText('Option');
    fireEvent.change(optionInputs[0], { target: { value: 'Option A' } });

    const submitButton = screen.getByText('Add Question');
    fireEvent.click(submitButton);

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('does not submit short answer without answer', () => {
    const onAdd = vi.fn();
    render(<QuestionForm {...defaultProps} onAdd={onAdd} />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'short' } });

    const promptInput = screen.getByPlaceholderText('Enter your question...');
    fireEvent.change(promptInput, { target: { value: 'Test question?' } });

    const submitButton = screen.getByText('Add Question');
    fireEvent.click(submitButton);

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('resets form after successful submit', () => {
    const onAdd = vi.fn();
    const { container } = render(<QuestionForm {...defaultProps} onAdd={onAdd} />);

    const promptInput = screen.getByPlaceholderText('Enter your question...') as HTMLTextAreaElement;
    fireEvent.change(promptInput, { target: { value: 'Test?' } });

    const optionInputs = screen.getAllByPlaceholderText('Option');
    fireEvent.change(optionInputs[0], { target: { value: 'A' } });
    fireEvent.change(optionInputs[1], { target: { value: 'B' } });

    const radioInputs = screen.getAllByRole('radio');
    fireEvent.click(radioInputs[0]);

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    expect(onAdd).toHaveBeenCalled();
    expect(promptInput.value).toBe('');
  });

  it('trims whitespace from prompt and answers', () => {
    const onAdd = vi.fn();
    const { container } = render(<QuestionForm {...defaultProps} onAdd={onAdd} />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'short' } });

    const promptInput = screen.getByPlaceholderText('Enter your question...');
    fireEvent.change(promptInput, { target: { value: '  What is 2+2?  ' } });

    const answerInput = screen.getByPlaceholderText('Enter correct answer...');
    fireEvent.change(answerInput, { target: { value: '  4  ' } });

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    expect(onAdd).toHaveBeenCalledWith({
      type: 'short',
      prompt: 'What is 2+2?',
      correctAnswer: '4',
    });
  });
});
