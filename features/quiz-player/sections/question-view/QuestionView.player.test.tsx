import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { QuestionViewPlayer } from './QuestionView.player';

// Mock state
let mockStore: any = {};
let mockQuizData: any = null;

// Mock dependencies
vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('../../components/mcq-answer', () => ({
  MCQAnswer: ({ options, selectedValue, onChange }: any) => (
    <div data-testid="mcq-answer">
      {options.map((opt: string, idx: number) => (
        <button key={idx} onClick={() => onChange(opt)}>
          {opt}
        </button>
      ))}
      <span>Selected: {selectedValue}</span>
    </div>
  ),
}));

vi.mock('../../components/short-answer', () => ({
  ShortAnswer: ({ value, onChange, placeholder }: any) => (
    <textarea
      data-testid="short-answer"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  ),
}));

vi.mock('../../store/player.store', () => ({
  usePlayerStore: (selector: any) => selector(mockStore),
}));

vi.mock('../../react-query', () => ({
  useGetQuizPlayer: () => ({ data: mockQuizData }),
}));

describe('QuestionViewPlayer', () => {
  const mockQuiz = {
    id: 1,
    title: 'Test Quiz',
    questions: [
      {
        id: 1,
        prompt: 'What is 2+2?',
        type: 'mcq',
        options: ['3', '4', '5'],
      },
      {
        id: 2,
        prompt: 'Explain the answer',
        type: 'short',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore = {
      attemptId: 1,
      currentQuestionIndex: 0,
      answers: {},
      setAnswer: vi.fn(),
    };
    mockQuizData = mockQuiz;
  });

  it('returns null when quiz data is not available', () => {
    mockQuizData = null;
    const { container } = render(<QuestionViewPlayer />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when attemptId is not available', () => {
    mockStore.attemptId = null;
    const { container } = render(<QuestionViewPlayer />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when quiz has no questions', () => {
    mockQuizData = { ...mockQuiz, questions: [] };
    const { container } = render(<QuestionViewPlayer />);
    expect(container.firstChild).toBeNull();
  });

  it('renders question header with number and total', () => {
    render(<QuestionViewPlayer />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
  });

  it('renders question type badge', () => {
    render(<QuestionViewPlayer />);
    expect(screen.getByText('MCQ')).toBeInTheDocument();
  });

  it('renders question prompt', () => {
    render(<QuestionViewPlayer />);
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument();
  });

  it('renders MCQ component for mcq type question', () => {
    render(<QuestionViewPlayer />);
    expect(screen.getByTestId('mcq-answer')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders ShortAnswer component for short type question', () => {
    mockStore.currentQuestionIndex = 1;
    render(<QuestionViewPlayer />);
    expect(screen.getByTestId('short-answer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('answer-placeholder')).toBeInTheDocument();
  });

  it('calls setAnswer when MCQ option is selected', async () => {
    render(<QuestionViewPlayer />);
    const option = screen.getByText('4');
    await userEvent.click(option);
    expect(mockStore.setAnswer).toHaveBeenCalledWith(1, '4');
  });

  it('calls setAnswer when short answer is changed', async () => {
    mockStore.currentQuestionIndex = 1;
    render(<QuestionViewPlayer />);
    const textarea = screen.getByTestId('short-answer');
    await userEvent.type(textarea, 'My answer');
    expect(mockStore.setAnswer).toHaveBeenCalled();
  });

  it('displays current answer from store', () => {
    mockStore.answers = { 1: '4' };
    render(<QuestionViewPlayer />);
    expect(screen.getByText('Selected: 4')).toBeInTheDocument();
  });

  it('displays empty string when no answer in store', () => {
    render(<QuestionViewPlayer />);
    expect(screen.getByText('Selected:')).toBeInTheDocument();
  });

  it('handles question without id gracefully', () => {
    mockQuizData = {
      ...mockQuiz,
      questions: [{ prompt: 'Test', type: 'mcq', options: ['A', 'B'] }],
    };
    render(<QuestionViewPlayer />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('does not call setAnswer when question has no id', async () => {
    mockQuizData = {
      ...mockQuiz,
      questions: [{ prompt: 'Test', type: 'mcq', options: ['A', 'B'] }],
    };
    render(<QuestionViewPlayer />);
    const option = screen.getByText('A');
    await userEvent.click(option);
    expect(mockStore.setAnswer).not.toHaveBeenCalled();
  });

  it('shows type-na when question type is undefined', () => {
    mockQuizData = {
      ...mockQuiz,
      questions: [{ id: 1, prompt: 'Test', options: ['A'] }],
    };
    render(<QuestionViewPlayer />);
    expect(screen.getByText('type-na')).toBeInTheDocument();
  });

  it('returns null when currentQuestion is undefined', () => {
    mockStore.currentQuestionIndex = 999; // Invalid index
    const { container } = render(<QuestionViewPlayer />);
    expect(container.firstChild).toBeNull();
  });
});
