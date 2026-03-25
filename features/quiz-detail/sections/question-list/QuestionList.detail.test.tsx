import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockDeleteMutate = vi.fn();
const mockUpdateMutate = vi.fn();
const mockOpenEditModal = vi.fn();
const mockOpenAddModal = vi.fn();

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'questions-list': 'Questions',
      'add-question': 'Add Question',
      type: 'Type',
      question: 'Question',
      'answer-label': 'Answer',
      edit: 'Edit',
      delete: 'Delete',
      'no-questions': 'No questions yet',
      'add-first-question': 'Add your first question',
      'delete-confirm': 'Are you sure you want to delete this question?',
      cancel: 'Cancel',
    };
    return translations[key] || key;
  },
}));

vi.mock('../../react-query', () => ({
  useGetQuizDetail: vi.fn(),
  useDeleteQuestion: vi.fn(),
  useUpdateQuestion: vi.fn(),
}));

vi.mock('../../store/quiz-detail.store', () => ({
  useQuizDetailStore: vi.fn(),
}));

import { useGetQuizDetail, useDeleteQuestion, useUpdateQuestion } from '../../react-query';
import { useQuizDetailStore } from '../../store/quiz-detail.store';

import { QuestionList } from './QuestionList.detail';

describe('QuestionList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuizDetailStore).mockReturnValue({
      openEditQuestionModal: mockOpenEditModal,
      openAddQuestionModal: mockOpenAddModal,
    } as any);
    vi.mocked(useDeleteQuestion).mockReturnValue({
      mutate: mockDeleteMutate,
    } as any);
    vi.mocked(useUpdateQuestion).mockReturnValue({
      mutate: mockUpdateMutate,
    } as any);
  });

  it('shows loading state when fetching quiz', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    render(<QuestionList />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders empty state when no questions', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: { id: 1, questions: [] },
      isLoading: false,
    } as any);

    render(<QuestionList />);
    expect(screen.getByText('No questions yet')).toBeInTheDocument();
    expect(screen.getByText('Add your first question')).toBeInTheDocument();
  });

  it('renders questions table with data', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: {
        id: 1,
        questions: [
          {
            id: 1,
            position: 1,
            type: 'mcq',
            prompt: 'What is React?',
            options: ['Library', 'Framework', 'Language'],
            correctAnswer: 0,
          },
          {
            id: 2,
            position: 2,
            type: 'short',
            prompt: 'What is JSX?',
            correctAnswer: 'JavaScript XML',
          },
        ],
      },
      isLoading: false,
    } as any);

    render(<QuestionList />);
    expect(screen.getByText('Questions (2)')).toBeInTheDocument();
    expect(screen.getAllByText('What is React?')[0]).toBeInTheDocument();
    expect(screen.getAllByText('What is JSX?')[0]).toBeInTheDocument();
  });

  it('displays MCQ correct answer from options', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: {
        id: 1,
        questions: [
          {
            id: 1,
            position: 1,
            type: 'mcq',
            prompt: 'What is React?',
            options: ['Library', 'Framework', 'Language'],
            correctAnswer: 0,
          },
        ],
      },
      isLoading: false,
    } as any);

    render(<QuestionList />);
    expect(screen.getByText('correct-answer:')).toBeInTheDocument();
    expect(screen.getByText('Library')).toBeInTheDocument();
  });

  it('displays short answer correct answer directly', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: {
        id: 1,
        questions: [
          {
            id: 2,
            position: 1,
            type: 'short',
            prompt: 'What is JSX?',
            correctAnswer: 'JavaScript XML',
          },
        ],
      },
      isLoading: false,
    } as any);

    render(<QuestionList />);
    expect(screen.getAllByText('JavaScript XML')[0]).toBeInTheDocument();
  });

  it('opens add question modal when add button clicked', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: { id: 1, questions: [] },
      isLoading: false,
    } as any);

    render(<QuestionList />);
    const addButton = screen.getByRole('button', { name: /Add Question/i });
    fireEvent.click(addButton);

    expect(mockOpenAddModal).toHaveBeenCalled();
  });

  it('opens edit question modal when edit button clicked', () => {
    const mockQuestion = {
      id: 1,
      position: 1,
      type: 'short',
      prompt: 'Test question',
      correctAnswer: 'Test answer',
    };

    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: {
        id: 1,
        questions: [mockQuestion],
      },
      isLoading: false,
    } as any);

    render(<QuestionList />);
    const editButtons = screen.getAllByRole('button', { name: /Edit/i });
    fireEvent.click(editButtons[0]);

    expect(mockOpenEditModal).toHaveBeenCalledWith(mockQuestion);
  });

  it('opens delete confirmation when delete button clicked', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: {
        id: 1,
        questions: [
          {
            id: 1,
            position: 1,
            type: 'short',
            prompt: 'Test',
            correctAnswer: 'Answer',
          },
        ],
      },
      isLoading: false,
    } as any);

    render(<QuestionList />);
    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText('Are you sure you want to delete this question?')).toBeInTheDocument();
  });

  it('calls delete mutation when delete confirmed', async () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: {
        id: 1,
        questions: [
          {
            id: 5,
            position: 1,
            type: 'short',
            prompt: 'Test',
            correctAnswer: 'Answer',
          },
        ],
      },
      isLoading: false,
    } as any);

    render(<QuestionList />);

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButtons[0]);

    const confirmButton = screen.getByRole('button', { name: /^Delete$/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteMutate).toHaveBeenCalledWith({ id: 5 });
    });
  });

  it('renders question types with proper styling', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: {
        id: 1,
        questions: [
          {
            id: 1,
            position: 1,
            type: 'mcq',
            prompt: 'MCQ Question',
            options: ['A', 'B'],
            correctAnswer: 0,
          },
          {
            id: 2,
            position: 2,
            type: 'short',
            prompt: 'Short Question',
            correctAnswer: 'Answer',
          },
        ],
      },
      isLoading: false,
    } as any);

    render(<QuestionList />);
    expect(screen.getAllByText('mcq')[0]).toBeInTheDocument();
    expect(screen.getAllByText('short')[0]).toBeInTheDocument();
  });

  it('displays question position numbers', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: {
        id: 1,
        questions: [
          {
            id: 1,
            position: 1,
            type: 'short',
            prompt: 'First',
            correctAnswer: 'A',
          },
          {
            id: 2,
            position: 2,
            type: 'short',
            prompt: 'Second',
            correctAnswer: 'B',
          },
        ],
      },
      isLoading: false,
    } as any);

    render(<QuestionList />);
    expect(screen.getByText(/#1/)).toBeInTheDocument();
    expect(screen.getByText(/#2/)).toBeInTheDocument();
  });

  it('shows correct question count in header', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: {
        id: 1,
        questions: [
          { id: 1, position: 1, type: 'short', prompt: 'Q1', correctAnswer: 'A1' },
          { id: 2, position: 2, type: 'short', prompt: 'Q2', correctAnswer: 'A2' },
          { id: 3, position: 3, type: 'short', prompt: 'Q3', correctAnswer: 'A3' },
        ],
      },
      isLoading: false,
    } as any);

    render(<QuestionList />);
    expect(screen.getByText('Questions (3)')).toBeInTheDocument();
  });

  it('handles missing correctAnswer in MCQ gracefully', () => {
    vi.mocked(useGetQuizDetail).mockReturnValue({
      data: {
        id: 1,
        questions: [
          {
            id: 1,
            position: 1,
            type: 'mcq',
            prompt: 'Question',
            options: ['A', 'B'],
            correctAnswer: null,
          },
        ],
      },
      isLoading: false,
    } as any);

    render(<QuestionList />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});
