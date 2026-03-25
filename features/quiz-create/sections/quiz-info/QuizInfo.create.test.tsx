import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { z } from 'zod';

import { QuizInfo } from './QuizInfo.create';

const mockNextStep = vi.fn();
let mockQuizMetadata: any = null;

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('../../store/quiz-create.store', () => ({
  useQuizCreateStore: vi.fn(() => ({
    quizMetadata: mockQuizMetadata,
    nextStep: mockNextStep,
  })),
}));

vi.mock('@/core/schemas', () => ({
  quizSchema: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    timeLimitSeconds: z.number().optional(),
  }),
}));

describe('QuizInfo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuizMetadata = null;
  });

  it('renders quiz info form with all fields', () => {
    render(<QuizInfo />);

    expect(screen.getByText('create-quiz-wizard-title')).toBeInTheDocument();
    expect(screen.getByText('create-quiz-wizard-step-1-description')).toBeInTheDocument();
    expect(screen.getByText('title-label')).toBeInTheDocument();
    expect(screen.getByText('description-label')).toBeInTheDocument();
    expect(screen.getByText('time-limit-label')).toBeInTheDocument();
  });

  it('renders title input field', () => {
    render(<QuizInfo />);

    const titleInput = screen.getByPlaceholderText('title-placeholder');
    expect(titleInput).toBeInTheDocument();
  });

  it('renders description textarea', () => {
    render(<QuizInfo />);

    const descriptionInput = screen.getByPlaceholderText('description-placeholder');
    expect(descriptionInput).toBeInTheDocument();
  });

  it('renders time limit input', () => {
    render(<QuizInfo />);

    const timeLimitInput = screen.getByDisplayValue('300');
    expect(timeLimitInput).toBeInTheDocument();
    expect(timeLimitInput).toHaveAttribute('type', 'number');
  });

  it('renders next button', () => {
    render(<QuizInfo />);

    const nextButton = screen.getByRole('button', { name: /next-add-questions/i });
    expect(nextButton).toBeInTheDocument();
  });

  it('has default time limit value of 300', () => {
    render(<QuizInfo />);

    const timeLimitInput = screen.getByDisplayValue('300') as HTMLInputElement;
    expect(timeLimitInput.value).toBe('300');
  });

  it('prefills form when quiz metadata exists', () => {
    mockQuizMetadata = {
      title: 'Existing Quiz',
      description: 'Existing Description',
      timeLimitSeconds: 600,
    };

    render(<QuizInfo />);

    expect((screen.getByPlaceholderText('title-placeholder') as HTMLInputElement).value).toBe(
      'Existing Quiz'
    );
    expect((screen.getByPlaceholderText('description-placeholder') as HTMLTextAreaElement).value).toBe(
      'Existing Description'
    );
    expect((screen.getByDisplayValue('600') as HTMLInputElement).value).toBe('600');
  });
});
