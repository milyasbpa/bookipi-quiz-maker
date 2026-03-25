import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useGetQuizDetail } from '../../react-query';

import { QuizHeader } from './QuizHeader.detail';

const mockQuiz = {
  id: 1,
  title: 'JavaScript Basics',
  description: 'Test your JS knowledge',
  timeLimitSeconds: 300,
  questions: [{ id: 1 }, { id: 2 }],
};

const mockPush = vi.fn();
const mockOpenEditModal = vi.fn();

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: any) => {
    if (key === 'questions-count') return `${values?.count} questions`;
    if (key === 'time-limit-minutes') return `${values?.minutes} minutes`;
    if (key === 'quiz-not-found') return 'Quiz not found';

    const translations: Record<string, string> = {
      'back-to-list': 'Back to List',
      'edit-quiz': 'Edit Quiz',
      'play-quiz': 'Play Quiz',
    };
    return translations[key] || key;
  },
}));

vi.mock('../../react-query', () => ({
  useGetQuizDetail: vi.fn(),
}));

vi.mock('../../store/quiz-detail.store', () => ({
  useQuizDetailStore: (selector: any) => selector({ openEditQuizModal: mockOpenEditModal }),
}));

describe('QuizHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state when fetching quiz', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    render(<QuizHeader />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows error state when quiz not found', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: null,
      isLoading: false,
    } as any);

    render(<QuizHeader />);
    expect(screen.getByText('Quiz not found')).toBeInTheDocument();
  });

  it('renders quiz title and description', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: mockQuiz,
      isLoading: false,
    } as any);

    render(<QuizHeader />);
    expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
    expect(screen.getByText('Test your JS knowledge')).toBeInTheDocument();
  });

  it('renders back button', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: mockQuiz,
      isLoading: false,
    } as any);

    render(<QuizHeader />);
    expect(screen.getByText('Back to List')).toBeInTheDocument();
  });

  it('renders edit and play buttons', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: mockQuiz,
      isLoading: false,
    } as any);

    render(<QuizHeader />);
    expect(screen.getByRole('button', { name: /Edit Quiz/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Play Quiz/i })).toBeInTheDocument();
  });

  it('opens edit modal when edit button clicked', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: mockQuiz,
      isLoading: false,
    } as any);

    render(<QuizHeader />);
    const editButton = screen.getByRole('button', { name: /Edit Quiz/i });
    fireEvent.click(editButton);

    expect(mockOpenEditModal).toHaveBeenCalledWith({
      title: 'JavaScript Basics',
      description: 'Test your JS knowledge',
      timeLimitSeconds: 300,
    });
  });
});
