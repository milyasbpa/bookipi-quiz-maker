import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { QuestionBreakdownPlayer } from './QuestionBreakdown.player';

let mockStore: any = {};
let mockQuizData: any = null;
let mockIsLoading = false;
let mockError: any = null;

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('../../store/player.store', () => ({
  usePlayerStore: (selector: any) => selector(mockStore),
}));

vi.mock('../../react-query', () => ({
  useGetQuizPlayer: () => ({
    data: mockQuizData,
    isLoading: mockIsLoading,
    error: mockError,
  }),
}));

describe('QuestionBreakdownPlayer', () => {
  const mockQuiz = {
    id: 1,
    questions: [
      { id: 1, prompt: 'What is 2+2?' },
      { id: 2, prompt: 'What is 3+3?' },
      { id: 3, prompt: 'What is 4+4?' },
    ],
  };

  const mockSubmitResult = {
    score: 2,
    details: [
      { questionId: 1, correct: true },
      { questionId: 2, correct: false, expected: '6' },
      { questionId: 3, correct: true },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore = {
      quizId: 1,
      submitResult: mockSubmitResult,
    };
    mockQuizData = mockQuiz;
    mockIsLoading = false;
    mockError = null;
  });

  it('shows loading state while loading', () => {
    mockIsLoading = true;
    render(<QuestionBreakdownPlayer />);
    expect(screen.getByText('loading-breakdown')).toBeInTheDocument();
  });

  it('shows error state when there is an error', () => {
    mockError = new Error('Failed');
    render(<QuestionBreakdownPlayer />);
    expect(screen.getByText('breakdown-load-error')).toBeInTheDocument();
  });

  it('shows error state when quiz data is missing', () => {
    mockQuizData = null;
    render(<QuestionBreakdownPlayer />);
    expect(screen.getByText('breakdown-load-error')).toBeInTheDocument();
  });

  it('shows error state when submitResult is missing', () => {
    mockStore.submitResult = null;
    render(<QuestionBreakdownPlayer />);
    expect(screen.getByText('breakdown-load-error')).toBeInTheDocument();
  });

  it('shows no questions message when quiz has no questions', () => {
    mockQuizData = { ...mockQuiz, questions: [] };
    render(<QuestionBreakdownPlayer />);
    expect(screen.getByText('no-questions')).toBeInTheDocument();
  });

  it('renders question breakdown title', () => {
    render(<QuestionBreakdownPlayer />);
    expect(screen.getByText('question-breakdown-title')).toBeInTheDocument();
  });

  it('renders all questions', () => {
    render(<QuestionBreakdownPlayer />);
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
    expect(screen.getByText('What is 3+3?')).toBeInTheDocument();
    expect(screen.getByText('What is 4+4?')).toBeInTheDocument();
  });

  it('renders question numbers', () => {
    render(<QuestionBreakdownPlayer />);
    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByText('Question 2')).toBeInTheDocument();
    expect(screen.getByText('Question 3')).toBeInTheDocument();
  });

  it('renders correct indicators', () => {
    render(<QuestionBreakdownPlayer />);
    const correctLabels = screen.getAllByText('correct');
    expect(correctLabels).toHaveLength(2); // Questions 1 and 3
  });

  it('renders incorrect indicators', () => {
    render(<QuestionBreakdownPlayer />);
    expect(screen.getByText('incorrect')).toBeInTheDocument(); // Question 2
  });

  it('shows correct answer for incorrect questions', () => {
    render(<QuestionBreakdownPlayer />);
    expect(screen.getByText('correct-answer-label')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('does not show correct answer for correct questions', () => {
    mockStore.submitResult = {
      ...mockSubmitResult,
      details: [
        { questionId: 1, correct: true },
        { questionId: 2, correct: true },
        { questionId: 3, correct: true },
      ],
    };
    render(<QuestionBreakdownPlayer />);
    expect(screen.queryByText('correct-answer-label')).not.toBeInTheDocument();
  });

  it('handles questions without detail', () => {
    mockStore.submitResult = {
      score: 0,
      details: [],
    };
    render(<QuestionBreakdownPlayer />);
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
  });

  it('handles undefined details', () => {
    mockStore.submitResult = {
      score: 0,
      details: undefined,
    };
    render(<QuestionBreakdownPlayer />);
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
  });

  it('handles undefined questions', () => {
    mockQuizData = { ...mockQuiz, questions: undefined };
    render(<QuestionBreakdownPlayer />);
    expect(screen.getByText('no-questions')).toBeInTheDocument();
  });

  it('applies green border styling to correct answers', () => {
    const { container } = render(<QuestionBreakdownPlayer />);
    const questionDivs = container.querySelectorAll('div[class*="border-green"]');
    expect(questionDivs.length).toBeGreaterThan(0);
  });

  it('applies red border styling to incorrect answers', () => {
    const { container } = render(<QuestionBreakdownPlayer />);
    const questionDivs = container.querySelectorAll('div[class*="border-red"]');
    expect(questionDivs.length).toBeGreaterThan(0);
  });

  it('renders CheckCircle icon for correct answers', () => {
    const { container } = render(<QuestionBreakdownPlayer />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('does not show correct answer when expected is not provided', () => {
    mockStore.submitResult = {
      score: 1,
      details: [
        { questionId: 1, correct: true },
        { questionId: 2, correct: false }, // No expected field
        { questionId: 3, correct: true },
      ],
    };
    render(<QuestionBreakdownPlayer />);
    expect(screen.queryByText('correct-answer-label')).not.toBeInTheDocument();
  });
});
