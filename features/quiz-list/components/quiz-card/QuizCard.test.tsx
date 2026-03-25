import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import type { QuizWithQuestions } from '@/core/api/generated/quizMakerAPI.schemas';

import { QuizCard } from './QuizCard';

const mockQuiz: QuizWithQuestions = {
  id: 1,
  title: 'JavaScript Basics',
  description: 'Learn fundamental JavaScript concepts',
  timeLimitSeconds: 600,
};

const mockTranslations = {
  manageQuestions: 'Manage Questions',
  startQuiz: 'Start Quiz',
  minutes: 'minutes',
};

describe('QuizCard', () => {
  it('renders quiz information correctly', () => {
    const onNavigateToDetail = vi.fn();
    const onNavigateToPlayer = vi.fn();

    render(
      <QuizCard
        quiz={mockQuiz}
        onNavigateToDetail={onNavigateToDetail}
        onNavigateToPlayer={onNavigateToPlayer}
        translations={mockTranslations}
      />,
    );

    expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
    expect(screen.getByText('Learn fundamental JavaScript concepts')).toBeInTheDocument();
    expect(screen.getByText(/10 minutes/)).toBeInTheDocument();
  });

  it('renders without time limit', () => {
    const quizWithoutTime = { ...mockQuiz, timeLimitSeconds: undefined };
    const onNavigateToDetail = vi.fn();
    const onNavigateToPlayer = vi.fn();

    render(
      <QuizCard
        quiz={quizWithoutTime}
        onNavigateToDetail={onNavigateToDetail}
        onNavigateToPlayer={onNavigateToPlayer}
        translations={mockTranslations}
      />,
    );

    expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
    expect(screen.queryByText(/minutes/)).not.toBeInTheDocument();
  });

  it('calls onNavigateToDetail when manage button is clicked', async () => {
    const user = userEvent.setup();
    const onNavigateToDetail = vi.fn();
    const onNavigateToPlayer = vi.fn();

    render(
      <QuizCard
        quiz={mockQuiz}
        onNavigateToDetail={onNavigateToDetail}
        onNavigateToPlayer={onNavigateToPlayer}
        translations={mockTranslations}
      />,
    );

    const manageButton = screen.getAllByText('Manage Questions')[0];
    await user.click(manageButton);

    expect(onNavigateToDetail).toHaveBeenCalledWith(1);
    expect(onNavigateToDetail).toHaveBeenCalledTimes(1);
  });

  it('calls onNavigateToPlayer when play button is clicked', async () => {
    const user = userEvent.setup();
    const onNavigateToDetail = vi.fn();
    const onNavigateToPlayer = vi.fn();

    render(
      <QuizCard
        quiz={mockQuiz}
        onNavigateToDetail={onNavigateToDetail}
        onNavigateToPlayer={onNavigateToPlayer}
        translations={mockTranslations}
      />,
    );

    const playButton = screen.getAllByText('Start Quiz')[0];
    await user.click(playButton);

    expect(onNavigateToPlayer).toHaveBeenCalledWith(1);
    expect(onNavigateToPlayer).toHaveBeenCalledTimes(1);
  });

  it('renders both action buttons', () => {
    const onNavigateToDetail = vi.fn();
    const onNavigateToPlayer = vi.fn();

    render(
      <QuizCard
        quiz={mockQuiz}
        onNavigateToDetail={onNavigateToDetail}
        onNavigateToPlayer={onNavigateToPlayer}
        translations={mockTranslations}
      />,
    );

    expect(screen.getAllByText('Manage Questions')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Start Quiz')[0]).toBeInTheDocument();
  });

  it('truncates long description with line-clamp-2', () => {
    const quizWithLongDesc = {
      ...mockQuiz,
      description: 'This is a very long description '.repeat(10),
    };
    const onNavigateToDetail = vi.fn();
    const onNavigateToPlayer = vi.fn();

    const { container } = render(
      <QuizCard
        quiz={quizWithLongDesc}
        onNavigateToDetail={onNavigateToDetail}
        onNavigateToPlayer={onNavigateToPlayer}
        translations={mockTranslations}
      />,
    );

    const description = container.querySelector('.line-clamp-2');
    expect(description).toBeInTheDocument();
  });
});
