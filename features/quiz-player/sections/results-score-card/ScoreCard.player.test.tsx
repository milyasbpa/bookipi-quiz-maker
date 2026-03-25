import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ScoreCardPlayer } from './ScoreCard.player';

// Mock state
let mockStore: any = {};
let mockQuizData: any = null;
let mockIsLoading = false;
let mockError: any = null;

// Mock dependencies
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

describe('ScoreCardPlayer', () => {
  const mockQuiz = {
    id: 1,
    questions: [
      { id: 1, prompt: 'Q1' },
      { id: 2, prompt: 'Q2' },
      { id: 3, prompt: 'Q3' },
      { id: 4, prompt: 'Q4' },
      { id: 5, prompt: 'Q5' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore = {
      quizId: 1,
      submitResult: {
        score: 3,
      },
    };
    mockQuizData = mockQuiz;
    mockIsLoading = false;
    mockError = null;
  });

  it('shows loading state while loading', () => {
    mockIsLoading = true;
    render(<ScoreCardPlayer />);
    expect(screen.getByText('loading-score')).toBeInTheDocument();
  });

  it('shows error state when there is an error', () => {
    mockError = new Error('Failed');
    render(<ScoreCardPlayer />);
    expect(screen.getByText('score-load-error')).toBeInTheDocument();
  });

  it('shows error state when quiz data is missing', () => {
    mockQuizData = null;
    render(<ScoreCardPlayer />);
    expect(screen.getByText('score-load-error')).toBeInTheDocument();
  });

  it('shows error state when submitResult is missing', () => {
    mockStore.submitResult = null;
    render(<ScoreCardPlayer />);
    expect(screen.getByText('score-load-error')).toBeInTheDocument();
  });

  it('displays score correctly', () => {
    render(<ScoreCardPlayer />);
    expect(screen.getByText('3 / 5')).toBeInTheDocument();
  });

  it('calculates and displays percentage correctly', () => {
    render(<ScoreCardPlayer />);
    expect(screen.getByText(/60%/)).toBeInTheDocument();
  });

  it('shows perfect score message for 100%', () => {
    mockStore.submitResult.score = 5;
    render(<ScoreCardPlayer />);
    expect(screen.getByText('perfect-score')).toBeInTheDocument();
  });

  it('shows great job message for >= 70%', () => {
    mockStore.submitResult.score = 4; // 80%
    render(<ScoreCardPlayer />);
    expect(screen.getByText('great-job')).toBeInTheDocument();
    expect(screen.queryByText('perfect-score')).not.toBeInTheDocument();
  });

  it('shows keep practicing message for < 50%', () => {
    mockStore.submitResult.score = 2; // 40%
    render(<ScoreCardPlayer />);
    expect(screen.getByText('keep-practicing')).toBeInTheDocument();
  });

  it('shows no message for 50-69% (middle range)', () => {
    mockStore.submitResult.score = 3; // 60%
    render(<ScoreCardPlayer />);
    expect(screen.queryByText('perfect-score')).not.toBeInTheDocument();
    expect(screen.queryByText('great-job')).not.toBeInTheDocument();
    expect(screen.queryByText('keep-practicing')).not.toBeInTheDocument();
  });

  it('handles score of 0', () => {
    mockStore.submitResult.score = 0;
    render(<ScoreCardPlayer />);
    expect(screen.getByText('0 / 5')).toBeInTheDocument();
    expect(screen.getByText(/0%/)).toBeInTheDocument();
    expect(screen.getByText('keep-practicing')).toBeInTheDocument();
  });

  it('handles undefined score as 0', () => {
    mockStore.submitResult.score = undefined;
    render(<ScoreCardPlayer />);
    expect(screen.getByText('0 / 5')).toBeInTheDocument();
  });

  it('handles quiz with no questions', () => {
    mockQuizData = { ...mockQuiz, questions: [] };
    const { container } = render(<ScoreCardPlayer />);
    expect(container.textContent).toContain('0');
    expect(container.textContent).toContain('%');
  });

  it('handles quiz with undefined questions', () => {
    mockQuizData = { ...mockQuiz, questions: undefined };
    const { container } = render(<ScoreCardPlayer />);
    expect(container.textContent).toContain('0');
  });

  it('uses green border for perfect score', () => {
    mockStore.submitResult.score = 5;
    const { container } = render(<ScoreCardPlayer />);
    const mainDiv = container.querySelector('div > div');
    expect(mainDiv?.className).toContain('border-green-500');
  });

  it('uses brand border for good score', () => {
    mockStore.submitResult.score = 4; // 80%
    const { container } = render(<ScoreCardPlayer />);
    const mainDiv = container.querySelector('div > div');
    expect(mainDiv?.className).toContain('border-brand');
  });

  it('uses orange border for low score', () => {
    mockStore.submitResult.score = 2; // 40%
    const { container } = render(<ScoreCardPlayer />);
    const mainDiv = container.querySelector('div > div');
    expect(mainDiv?.className).toContain('border-orange-500');
  });

  it('uses default border for middle score', () => {
    mockStore.submitResult.score = 3; // 60%
    const { container } = render(<ScoreCardPlayer />);
    const mainDiv = container.querySelector('div > div');
    expect(mainDiv?.className).toContain('border-border');
  });

  it('displays Trophy icon for perfect score', () => {
    mockStore.submitResult.score = 5;
    const { container } = render(<ScoreCardPlayer />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
