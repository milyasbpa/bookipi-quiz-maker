import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useUpdateQuiz } from '../../react-query';

import { Edit } from './Edit.quiz-detail';

const mockMutate = vi.fn();
const mockCloseModal = vi.fn();

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '5' }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'edit-quiz-modal-title': 'Edit Quiz',
      'edit-quiz-modal-description': 'Update quiz information',
      'title-label': 'Quiz Title',
      'title-placeholder': 'Enter quiz title',
      'description-label': 'Description',
      'description-placeholder': 'Enter quiz description',
      'time-limit-label': 'Time Limit (seconds)',
      'update-quiz': 'Update Quiz',
      updating: 'Updating...',
    };
    return translations[key] || key;
  },
}));

vi.mock('../../react-query', () => ({
  useUpdateQuiz: vi.fn(),
}));

const mockCloseEditModal = vi.fn();

let mockQuizDetailStoreState: any = {
  isEditQuizModalOpen: false,
  closeEditQuizModal: mockCloseEditModal,
  editQuizData: null,
};

vi.mock('../../store/quiz-detail.store', () => ({
  useQuizDetailStore: (selector: any) => selector(mockQuizDetailStoreState),
}));

describe('Edit (Edit Quiz Modal)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUpdateQuiz).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);

    mockQuizDetailStoreState = {
      isEditQuizModalOpen: false,
      closeEditQuizModal: mockCloseEditModal,
      editQuizData: null,
    };
  });

  it('renders modal when open', () => {
    mockQuizDetailStoreState = {
      isEditQuizModalOpen: true,
      closeEditQuizModal: mockCloseEditModal,
      editQuizData: {
        title: 'Test Quiz',
        description: 'Test Description',
        timeLimitSeconds: 300,
      },
    };

    render(<Edit />);
    expect(screen.getByText('Edit Quiz')).toBeInTheDocument();
    expect(screen.getByText('Update quiz information')).toBeInTheDocument();
  });

  it('does not render modal when closed', () => {
    mockQuizDetailStoreState = {
      isEditQuizModalOpen: false,
      closeEditQuizModal: mockCloseEditModal,
      editQuizData: null,
    };

    render(<Edit />);
    expect(screen.queryByText('Edit Quiz')).not.toBeInTheDocument();
  });

  it('pre-fills form with existing quiz data', () => {
    mockQuizDetailStoreState = {
      isEditQuizModalOpen: true,
      closeEditQuizModal: mockCloseEditModal,
      editQuizData: {
        title: 'JavaScript Basics',
        description: 'Learn JS fundamentals',
        timeLimitSeconds: 600,
      },
    };

    render(<Edit />);
    expect(screen.getByDisplayValue('JavaScript Basics')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Learn JS fundamentals')).toBeInTheDocument();
    expect(screen.getByDisplayValue('600')).toBeInTheDocument();
  });

  it('handles quiz data without timeLimitSeconds', () => {
    mockQuizDetailStoreState = {
      isEditQuizModalOpen: true,
      closeEditQuizModal: mockCloseEditModal,
      editQuizData: {
        title: 'No Time Limit Quiz',
        description: 'Take your time',
        timeLimitSeconds: undefined,
      },
    };

    render(<Edit />);
    expect(screen.getByDisplayValue('No Time Limit Quiz')).toBeInTheDocument();
    expect(screen.getByDisplayValue('300')).toBeInTheDocument(); // Default value
  });

  it('calls updateQuiz mutation on form submit', async () => {
    mockQuizDetailStoreState = {
      isEditQuizModalOpen: true,
      closeEditQuizModal: mockCloseEditModal,
      editQuizData: {
        title: 'Old Title',
        description: 'Old Description',
        timeLimitSeconds: 300,
      },
    };

    render(<Edit />);

    const titleInput = screen.getByDisplayValue('Old Title');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

    const descInput = screen.getByDisplayValue('Old Description');
    fireEvent.change(descInput, { target: { value: 'Updated Description' } });

    const timeInput = screen.getByDisplayValue('300');
    fireEvent.change(timeInput, { target: { valueAsNumber: 450 } });

    const submitButton = screen.getByRole('button', { name: /Update Quiz/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: 5,
        data: {
          title: 'Updated Title',
          description: 'Updated Description',
          timeLimitSeconds: 450,
          isPublished: true,
        },
      });
    });
  });

  it('always sends isPublished: true to API', async () => {
    mockQuizDetailStoreState = {
      isEditQuizModalOpen: true,
      closeEditQuizModal: mockCloseEditModal,
      editQuizData: {
        title: 'Test Quiz',
        description: 'Test Description',
        timeLimitSeconds: 300,
      },
    };

    render(<Edit />);

    const submitButton = screen.getByRole('button', { name: /Update Quiz/i });
    fireEvent.click(submitButton);

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

  it('disables form when mutation is pending', () => {
    mockQuizDetailStoreState = {
      isEditQuizModalOpen: true,
      closeEditQuizModal: mockCloseEditModal,
      editQuizData: {
        title: 'Test Quiz Title',
        description: 'Test Description',
        timeLimitSeconds: 300,
      },
    };

    vi.mocked(useUpdateQuiz).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);

    render(<Edit />);

    const titleInput = screen.getByDisplayValue('Test Quiz Title');
    expect(titleInput).toBeDisabled();

    const submitButton = screen.getByRole('button', { name: /Updating/i });
    expect(submitButton).toBeDisabled();
  });

  it('uses correct quizId from params', async () => {
    mockQuizDetailStoreState = {
      isEditQuizModalOpen: true,
      closeEditQuizModal: mockCloseEditModal,
      editQuizData: {
        title: 'Test Quiz For ID',
        description: 'Test Description For ID',
        timeLimitSeconds: 300,
      },
    };

    render(<Edit />);

    const submitButton = screen.getByRole('button', { name: /Update Quiz/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 5, // From useParams mock
        }),
      );
    });
  });

  it('resets form when editQuizData changes', () => {
    const { rerender } = render(<Edit />);

    mockQuizDetailStoreState = {
      isEditQuizModalOpen: true,
      closeEditQuizModal: mockCloseEditModal,
      editQuizData: {
        title: 'First Quiz',
        description: 'First Description',
        timeLimitSeconds: 300,
      },
    };

    rerender(<Edit />);
    expect(screen.getByDisplayValue('First Quiz')).toBeInTheDocument();

    mockQuizDetailStoreState = {
      isEditQuizModalOpen: true,
      closeEditQuizModal: mockCloseEditModal,
      editQuizData: {
        title: 'Second Quiz',
        description: 'Second Description',
        timeLimitSeconds: 600,
      },
    };

    rerender(<Edit />);
    expect(screen.getByDisplayValue('Second Quiz')).toBeInTheDocument();
  });
});
