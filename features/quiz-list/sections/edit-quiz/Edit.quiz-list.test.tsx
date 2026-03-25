import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { Edit } from './Edit.quiz-list';

const mockQuizData = {
  title: 'JavaScript Basics',
  description: 'Test your JS knowledge',
  timeLimitSeconds: 300,
};

const mockMutate = vi.fn();
const mockCloseModal = vi.fn();

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('../../store', () => ({
  useQuizListStore: (selector: any) => {
    const store = {
      isEditModalOpen: true,
      closeEditModal: mockCloseModal,
      editQuizId: 1,
      editQuizData: mockQuizData,
    };
    return selector(store);
  },
}));

vi.mock('../../react-query/hooks/useUpdateQuiz', () => ({
  useUpdateQuiz: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

describe('Edit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the edit modal when open', () => {
    render(<Edit />);
    expect(screen.getByText('edit-quiz-modal-title')).toBeInTheDocument();
    expect(screen.getByText('edit-quiz-modal-description')).toBeInTheDocument();
  });

  it('pre-fills form with quiz data', () => {
    render(<Edit />);
    expect(screen.getByDisplayValue('JavaScript Basics')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test your JS knowledge')).toBeInTheDocument();
    expect(screen.getByDisplayValue('300')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render(<Edit />);
    expect(screen.getByText('title-label')).toBeInTheDocument();
    expect(screen.getByText('description-label')).toBeInTheDocument();
    expect(screen.getByText('time-limit-label')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<Edit />);
    expect(screen.getByRole('button', { name: /update-quiz/i })).toBeInTheDocument();
  });

  it('submits form with current values when form is submitted', async () => {
    render(<Edit />);

    const submitButton = screen.getByRole('button', { name: /update-quiz/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: 1,
        data: expect.objectContaining({
          title: 'JavaScript Basics',
          description: 'Test your JS knowledge',
          timeLimitSeconds: 300,
          isPublished: true,
        }),
      });
    });
  });

  it('always sends isPublished: true to API', async () => {
    render(<Edit />);

    const submitButton = screen.getByRole('button', { name: /update-quiz/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            isPublished: true,
          }),
        }),
      );
    });
  });
});
