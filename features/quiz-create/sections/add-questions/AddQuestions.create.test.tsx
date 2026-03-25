import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { AddQuestions } from './AddQuestions.create';

const mockPrevStep = vi.fn();
const mockAddQuestion = vi.fn();
const mockUpdateQuestion = vi.fn();
const mockRemoveQuestion = vi.fn();
const mockReorderQuestions = vi.fn();
const mockReset = vi.fn();
const mockPush = vi.fn();
const mockMutateAsync = vi.fn();

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

let mockQuestions: any[] = [];

vi.mock('../../store/quiz-create.store', () => ({
  useQuizCreateStore: vi.fn(() => ({
    quizMetadata: { title: 'Test Quiz', description: 'Test', timeLimitSeconds: 300 },
    questions: mockQuestions,
    prevStep: mockPrevStep,
    addQuestion: mockAddQuestion,
    updateQuestion: mockUpdateQuestion,
    removeQuestion: mockRemoveQuestion,
    reorderQuestions: mockReorderQuestions,
    reset: mockReset,
  })),
}));

vi.mock('../../react-query', () => ({
  useCreateQuiz: () => ({
    mutateAsync: mockMutateAsync.mockResolvedValue({ id: 123 }),
  }),
}));

vi.mock('@/core/api/generated/questions/questions', () => ({
  useCreateQuestion: () => ({
    mutateAsync: vi.fn().mockResolvedValue({}),
  }),
}));

describe('AddQuestions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuestions = [];
  });

  it('renders add questions section with title', () => {
    render(<AddQuestions />);

    expect(screen.getByText('add-questions')).toBeInTheDocument();
  });

  it('renders back button', () => {
    render(<AddQuestions />);

    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeInTheDocument();
  });

  it('calls prevStep when back button is clicked', () => {
    render(<AddQuestions />);

    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    expect(mockPrevStep).toHaveBeenCalled();
  });

  it('renders submit quiz button', () => {
    render(<AddQuestions />);

    const submitButton = screen.getByRole('button', { name: /submit-quiz/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('renders question form', () => {
    render(<AddQuestions />);

    expect(screen.getByText('add-question')).toBeInTheDocument();
  });

  it('shows empty state when no questions added', () => {
    render(<AddQuestions />);

    expect(screen.getByText('no-questions-added')).toBeInTheDocument();
  });

  it('displays questions list when questions exist', () => {
    mockQuestions = [
      {
        type: 'mcq',
        prompt: 'What is 2+2?',
        options: ['2', '3', '4', '5'],
        correctAnswer: 2,
      },
      {
        type: 'short',
        prompt: 'What is the capital of France?',
        correctAnswer: 'Paris',
      },
    ];

    render(<AddQuestions />);

    expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument();
  });

  it('shows delete buttons for each question', () => {
    mockQuestions = [
      {
        type: 'mcq',
        prompt: 'Question 1?',
        options: ['A', 'B'],
        correctAnswer: 0,
      },
      {
        type: 'short',
        prompt: 'Question 2?',
        correctAnswer: 'answer',
      },
    ];

    render(<AddQuestions />);

    const deleteButtons = screen.getAllByRole('button');
    const trashButtons = deleteButtons.filter((btn) => btn.querySelector('svg'));
    expect(trashButtons.length).toBeGreaterThan(0);
  });

  it('shows error toast when submitting without questions', async () => {
    render(<AddQuestions />);

    const submitButton = screen.getByRole('button', { name: /submit-quiz/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('add-at-least-one-question');
    });
  });

  it('disables submit button when loading', async () => {
    mockQuestions = [{ type: 'mcq', prompt: 'Test?', options: ['A', 'B'], correctAnswer: 0 }];

    let resolvePromise: any;
    mockMutateAsync.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      }),
    );

    render(<AddQuestions />);

    const submitButton = screen.getByRole('button', { name: /submit-quiz/i }) as HTMLButtonElement;
    expect(submitButton.disabled).toBe(false);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton.disabled).toBe(true);
    });

    resolvePromise({ id: 123 });
  });
});
