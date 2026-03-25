import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import type { Question } from '@/core/api/generated/quizMakerAPI.schemas';

import { QuestionCard } from './QuestionCard';

const mockTranslations = {
  answerLabel: 'Answer',
  correctAnswer: 'Correct Answer',
  edit: 'Edit',
  delete: 'Delete',
};

describe('QuestionCard', () => {
  it('renders MCQ question with simple view (showAllOptions=false)', () => {
    const question: Question = {
      id: 1,
      position: 1,
      type: 'mcq',
      prompt: 'What is React?',
      correctAnswer: 0,
      options: ['A library', 'A framework', 'An IDE'],
    };

    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <QuestionCard
        question={question}
        showAllOptions={false}
        onEdit={onEdit}
        onDelete={onDelete}
        translations={mockTranslations}
      />,
    );

    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('mcq')).toBeInTheDocument();
    expect(screen.getByText('What is React?')).toBeInTheDocument();
    expect(screen.getByText(/A library/)).toBeInTheDocument();
    expect(screen.queryByText('A framework')).not.toBeInTheDocument();
  });

  it('renders MCQ question with all options (showAllOptions=true)', () => {
    const question: Question = {
      id: 1,
      position: 1,
      type: 'mcq',
      prompt: 'What is React?',
      correctAnswer: 0,
      options: ['A library', 'A framework', 'An IDE'],
    };

    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <QuestionCard
        question={question}
        showAllOptions
        onEdit={onEdit}
        onDelete={onDelete}
        translations={mockTranslations}
      />,
    );

    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('Correct Answer:')).toBeInTheDocument();
    expect(screen.getByText('A library')).toBeInTheDocument();
    expect(screen.getByText('A framework')).toBeInTheDocument();
    expect(screen.getByText('An IDE')).toBeInTheDocument();
  });

  it('renders short answer question with simple view', () => {
    const question: Question = {
      id: 2,
      position: 2,
      type: 'short',
      prompt: 'What is TypeScript?',
      correctAnswer: 'A typed superset of JavaScript',
    };

    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <QuestionCard
        question={question}
        showAllOptions={false}
        onEdit={onEdit}
        onDelete={onDelete}
        translations={mockTranslations}
      />,
    );

    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(screen.getByText('short')).toBeInTheDocument();
    expect(screen.getByText('What is TypeScript?')).toBeInTheDocument();
    expect(screen.getByText(/A typed superset of JavaScript/)).toBeInTheDocument();
  });

  it('renders short answer with highlighted view (showAllOptions=true)', () => {
    const question: Question = {
      id: 2,
      position: 2,
      type: 'short',
      prompt: 'What is TypeScript?',
      correctAnswer: 'A typed superset of JavaScript',
    };

    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <QuestionCard
        question={question}
        showAllOptions
        onEdit={onEdit}
        onDelete={onDelete}
        translations={mockTranslations}
      />,
    );

    expect(screen.getByText('Correct Answer:')).toBeInTheDocument();
    expect(screen.getByText('A typed superset of JavaScript')).toBeInTheDocument();
  });

  it('uses displayNumber prop when provided', () => {
    const question: Question = {
      id: 1,
      position: 5,
      type: 'short',
      prompt: 'Test',
      correctAnswer: 'Answer',
    };

    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <QuestionCard
        question={question}
        displayNumber={3}
        onEdit={onEdit}
        onDelete={onDelete}
        translations={mockTranslations}
      />,
    );

    expect(screen.getByText('#3')).toBeInTheDocument();
    expect(screen.queryByText('#5')).not.toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    const question: Question = {
      id: 1,
      position: 1,
      type: 'short',
      prompt: 'Test',
      correctAnswer: 'Answer',
    };

    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <QuestionCard
        question={question}
        onEdit={onEdit}
        onDelete={onDelete}
        translations={mockTranslations}
      />,
    );

    const editButton = screen.getAllByText('Edit')[0];
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(question);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const question: Question = {
      id: 5,
      position: 5,
      type: 'short',
      prompt: 'Write code',
      correctAnswer: 'console.log("Hello")',
    };

    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <QuestionCard
        question={question}
        onEdit={onEdit}
        onDelete={onDelete}
        translations={mockTranslations}
      />,
    );

    const deleteButton = screen.getAllByText('Delete')[0];
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(5);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when disabled prop is true', () => {
    const question: Question = {
      id: 1,
      position: 1,
      type: 'short',
      prompt: 'Test',
      correctAnswer: 'Answer',
    };

    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <QuestionCard
        question={question}
        disabled
        onEdit={onEdit}
        onDelete={onDelete}
        translations={mockTranslations}
      />,
    );

    const editButton = screen.getAllByText('Edit')[0];
    const deleteButton = screen.getAllByText('Delete')[0];

    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });
});
