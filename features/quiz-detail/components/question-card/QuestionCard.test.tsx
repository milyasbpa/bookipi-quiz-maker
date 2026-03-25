import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import type { Question } from '@/core/api/generated/quizMakerAPI.schemas';

import { QuestionCard } from './QuestionCard';

const mockTranslations = {
  answerLabel: 'Answer',
  edit: 'Edit',
  delete: 'Delete',
};

describe('QuestionCard', () => {
  it('renders MCQ question correctly', () => {
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
        onEdit={onEdit}
        onDelete={onDelete}
        translations={mockTranslations}
      />,
    );

    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('mcq')).toBeInTheDocument();
    expect(screen.getByText('What is React?')).toBeInTheDocument();
    expect(screen.getByText(/A library/)).toBeInTheDocument();
  });

  it('renders short answer question correctly', () => {
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

  it('renders without answer when not provided', () => {
    const question: Question = {
      id: 3,
      position: 3,
      type: 'short',
      prompt: 'Test question',
      correctAnswer: undefined,
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

    expect(screen.getByText(/-/)).toBeInTheDocument();
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

  it('renders both action buttons', () => {
    const question: Question = {
      id: 1,
      position: 1,
      type: 'mcq',
      prompt: 'Test',
      correctAnswer: 0,
      options: ['A', 'B'],
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

    expect(screen.getAllByText('Edit')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Delete')[0]).toBeInTheDocument();
  });

  it('truncates long answers with line-clamp-2', () => {
    const question: Question = {
      id: 1,
      position: 1,
      type: 'short',
      prompt: 'Test',
      correctAnswer: 'This is a very long answer '.repeat(10),
    };

    const onEdit = vi.fn();
    const onDelete = vi.fn();

    const { container } = render(
      <QuestionCard
        question={question}
        onEdit={onEdit}
        onDelete={onDelete}
        translations={mockTranslations}
      />,
    );

    const answerElement = container.querySelector('.line-clamp-2');
    expect(answerElement).toBeInTheDocument();
  });
});
