import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { QuizHeaderPlayer } from './QuizHeader.player';

let mockStore: any = {};
let mockQuizData: any = null;
let mockIsLoading = false;
let mockError: any = null;
const mockStartAttempt = vi.fn();
const mockSubmitAttempt = vi.fn();
let mockIsStartingAttempt = false;

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('sonner', () => ({
  toast: {
    info: vi.fn(),
  },
}));

vi.mock('../../components/progress-bar', () => ({
  ProgressBar: ({ current, total }: any) => (
    <div data-testid="progress-bar">
      {current + 1} / {total}
    </div>
  ),
}));

vi.mock('../../components/countdown-timer', () => ({
  CountdownTimer: ({ remainingSeconds, onTick, onTimeUp }: any) => (
    <div data-testid="countdown-timer">
      <span>Time: {remainingSeconds}s</span>
      <button onClick={() => onTick(remainingSeconds - 1)}>Tick</button>
      <button onClick={onTimeUp}>Time Up</button>
    </div>
  ),
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
  useStartAttempt: () => ({
    mutate: mockStartAttempt,
    isPending: mockIsStartingAttempt,
  }),
  useSubmitAttempt: () => ({
    mutate: mockSubmitAttempt,
  }),
}));

describe('QuizHeaderPlayer', () => {
  const mockQuiz = {
    id: 1,
    title: 'Math Quiz',
    description: 'Test your math skills',
    timeLimitSeconds: 600,
    questions: [
      { id: 1, prompt: 'Q1', type: 'mcq' },
      { id: 2, prompt: 'Q2', type: 'short' },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore = {
      attemptId: 1,
      currentQuestionIndex: 0,
      setQuizId: vi.fn(),
      remainingSeconds: 600,
      setRemainingSeconds: vi.fn(),
      phase: 'playing',
    };
    mockQuizData = mockQuiz;
    mockIsLoading = false;
    mockError = null;
    mockIsStartingAttempt = false;
  });

  it('shows loading state when quiz is loading', () => {
    mockIsLoading = true;
    mockQuizData = null;
    render(<QuizHeaderPlayer />);
    expect(screen.getByText('loading-quiz')).toBeInTheDocument();
  });

  it('shows loading state when quiz data is not available', () => {
    mockQuizData = null;
    render(<QuizHeaderPlayer />);
    expect(screen.getByText('loading-quiz')).toBeInTheDocument();
  });

  it('shows loading state when attemptId is not available', () => {
    mockStore.attemptId = null;
    render(<QuizHeaderPlayer />);
    expect(screen.getByText('loading-quiz')).toBeInTheDocument();
  });

  it('shows error state when there is an error', () => {
    mockError = new Error('Failed to load');
    render(<QuizHeaderPlayer />);
    expect(screen.getByText('quiz-load-error')).toBeInTheDocument();
  });

  it('shows no questions state when questions array is empty', () => {
    mockQuizData = { ...mockQuiz, questions: [] };
    render(<QuizHeaderPlayer />);
    expect(screen.getByText('no-questions-yet')).toBeInTheDocument();
  });

  it('shows no questions state when questions is undefined', () => {
    mockQuizData = { ...mockQuiz, questions: undefined };
    render(<QuizHeaderPlayer />);
    expect(screen.getByText('no-questions-yet')).toBeInTheDocument();
  });

  it('renders quiz title', () => {
    render(<QuizHeaderPlayer />);
    expect(screen.getByText('Math Quiz')).toBeInTheDocument();
  });

  it('renders default title when quiz has no title', () => {
    mockQuizData = { ...mockQuiz, title: '' };
    render(<QuizHeaderPlayer />);
    expect(screen.getByText('untitled-quiz')).toBeInTheDocument();
  });

  it('renders quiz description', () => {
    render(<QuizHeaderPlayer />);
    expect(screen.getByText('Test your math skills')).toBeInTheDocument();
  });

  it('renders default description when quiz has no description', () => {
    mockQuizData = { ...mockQuiz, description: '' };
    render(<QuizHeaderPlayer />);
    expect(screen.getByText('no-description')).toBeInTheDocument();
  });

  it('renders progress bar with current and total questions', () => {
    render(<QuizHeaderPlayer />);
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('renders countdown timer when quiz has time limit', () => {
    render(<QuizHeaderPlayer />);
    expect(screen.getByTestId('countdown-timer')).toBeInTheDocument();
    expect(screen.getByText('Time: 600s')).toBeInTheDocument();
  });

  it('does not render countdown timer when quiz has no time limit', () => {
    mockQuizData = { ...mockQuiz, timeLimitSeconds: null };
    render(<QuizHeaderPlayer />);
    expect(screen.queryByTestId('countdown-timer')).not.toBeInTheDocument();
  });

  it('calls setQuizId when quiz is loaded', async () => {
    render(<QuizHeaderPlayer />);
    await waitFor(() => {
      expect(mockStore.setQuizId).toHaveBeenCalledWith(1);
    });
  });

  it('calls startAttempt when quiz is loaded and no attemptId', async () => {
    mockStore.attemptId = null;
    mockIsLoading = true;
    const { rerender } = render(<QuizHeaderPlayer />);

    mockIsLoading = false;
    mockStore.attemptId = null;
    rerender(<QuizHeaderPlayer />);

    await waitFor(() => {
      expect(mockStartAttempt).toHaveBeenCalledWith({ data: { quizId: 1 } });
    });
  });

  it('does not call startAttempt when already starting', async () => {
    mockStore.attemptId = null;
    mockIsStartingAttempt = true;
    render(<QuizHeaderPlayer />);

    await waitFor(
      () => {
        expect(mockStartAttempt).not.toHaveBeenCalled();
      },
      { timeout: 500 },
    );
  });

  it('initializes timer when phase is playing and remainingSeconds is null', async () => {
    mockStore.remainingSeconds = null;
    mockStore.phase = 'playing';
    render(<QuizHeaderPlayer />);

    await waitFor(() => {
      expect(mockStore.setRemainingSeconds).toHaveBeenCalledWith(600);
    });
  });

  it('does not initialize timer when not in playing phase', async () => {
    mockStore.remainingSeconds = null;
    mockStore.phase = 'completed';
    render(<QuizHeaderPlayer />);

    await waitFor(
      () => {
        expect(mockStore.setRemainingSeconds).not.toHaveBeenCalled();
      },
      { timeout: 500 },
    );
  });

  it('calls setRemainingSeconds on tick', async () => {
    render(<QuizHeaderPlayer />);
    const tickButton = screen.getByText('Tick');
    tickButton.click();

    await waitFor(() => {
      expect(mockStore.setRemainingSeconds).toHaveBeenCalledWith(599);
    });
  });

  it('calls submitAttempt and shows toast when time is up', async () => {
    const { toast } = await import('sonner');
    render(<QuizHeaderPlayer />);
    const timeUpButton = screen.getByText('Time Up');
    timeUpButton.click();

    await waitFor(() => {
      expect(toast.info).toHaveBeenCalledWith('time-up');
      expect(mockSubmitAttempt).toHaveBeenCalled();
    });
  });
});
