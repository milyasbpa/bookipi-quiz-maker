import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { NavigationPlayer } from './Navigation.player';

// Mock state
let mockStore = {
  attemptId: 1,
  currentQuestionIndex: 0,
  goToNext: vi.fn(),
  goToPrevious: vi.fn(),
};

let mockQuizData: any = null;
let mockIsSubmitting = false;
const mockSubmitAttempt = vi.fn();

// Mock dependencies
vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/core/components', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} data-testid={props['data-testid']}>
      {children}
    </button>
  ),
}));

vi.mock('../../store/player.store', () => ({
  usePlayerStore: (selector: any) => selector(mockStore),
}));

vi.mock('../../react-query', () => ({
  useGetQuizPlayer: () => ({ data: mockQuizData }),
  useSubmitAttempt: () => ({
    mutate: mockSubmitAttempt,
    isPending: mockIsSubmitting,
  }),
}));

describe('NavigationPlayer', () => {
  const mockQuiz = {
    id: 1,
    title: ' Quiz',
    questions: [
      { id: 1, text: 'Q1', type: 'mcq' },
      { id: 2, text: 'Q2', type: 'mcq' },
      { id: 3, text: 'Q3', type: 'mcq' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore = {
      attemptId: 1,
      currentQuestionIndex: 0,
      goToNext: vi.fn(),
      goToPrevious: vi.fn(),
    };
    mockQuizData = mockQuiz;
    mockIsSubmitting = false;
  });

  it('returns null when quiz data is not available', () => {
    mockQuizData = null;
    const { container } = render(<NavigationPlayer />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when attemptId is not available', () => {
    mockStore.attemptId = null as any;
    const { container } = render(<NavigationPlayer />);
    expect(container.firstChild).toBeNull();
  });

  it('renders navigation buttons on first question', () => {
    render(<NavigationPlayer />);
    expect(screen.getByText('previous')).toBeInTheDocument();
    expect(screen.getByText('next')).toBeInTheDocument();
  });

  it('disables previous button on first question', () => {
    render(<NavigationPlayer />);
    const prevButton = screen.getByText('previous');
    expect(prevButton).toBeDisabled();
  });

  it('enables previous button when not on first question', () => {
    mockStore.currentQuestionIndex = 1;
    render(<NavigationPlayer />);
    const prevButton = screen.getByText('previous');
    expect(prevButton).not.toBeDisabled();
  });

  it('calls goToPrevious when previous button clicked', async () => {
    mockStore.currentQuestionIndex = 1;
    render(<NavigationPlayer />);
    const prevButton = screen.getByText('previous');
    await userEvent.click(prevButton);
    expect(mockStore.goToPrevious).toHaveBeenCalledTimes(1);
  });

  it('calls goToNext with total questions when next button clicked', async () => {
    render(<NavigationPlayer />);
    const nextButton = screen.getByText('next');
    await userEvent.click(nextButton);
    expect(mockStore.goToNext).toHaveBeenCalledWith(3);
  });

  it('shows submit button on last question', () => {
    mockStore.currentQuestionIndex = 2;
    render(<NavigationPlayer />);
    expect(screen.getByText('submit')).toBeInTheDocument();
    expect(screen.queryByText('next')).not.toBeInTheDocument();
  });

  it('shows submitting state when submitting', () => {
    mockStore.currentQuestionIndex = 2;
    mockIsSubmitting = true;
    render(<NavigationPlayer />);
    expect(screen.getByText('submitting')).toBeInTheDocument();
  });

  it('calls submitAttempt when submit button clicked and confirmed', async () => {
    global.confirm = vi.fn(() => true);
    mockStore.currentQuestionIndex = 2;
    render(<NavigationPlayer />);
    const submitButton = screen.getByText('submit');
    await userEvent.click(submitButton);
    expect(global.confirm).toHaveBeenCalledWith('submit-confirm');
    expect(mockSubmitAttempt).toHaveBeenCalledTimes(1);
  });

  it('does not submit when confirmation is cancelled', async () => {
    global.confirm = vi.fn(() => false);
    mockStore.currentQuestionIndex = 2;
    render(<NavigationPlayer />);
    const submitButton = screen.getByText('submit');
    await userEvent.click(submitButton);
    expect(mockSubmitAttempt).not.toHaveBeenCalled();
  });

  it('disables previous button when submitting', () => {
    mockIsSubmitting = true;
    render(<NavigationPlayer />);
    const prevButton = screen.getByText('previous');
    expect(prevButton).toBeDisabled();
  });

  it('disables next button when submitting', () => {
    mockIsSubmitting = true;
    render(<NavigationPlayer />);
    const nextButton = screen.getByText('next');
    expect(nextButton).toBeDisabled();
  });
});
