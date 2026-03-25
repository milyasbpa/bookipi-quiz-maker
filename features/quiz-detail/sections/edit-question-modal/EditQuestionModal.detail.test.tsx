import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useUpdateQuestion } from '../../react-query';

import { EditQuestionModal } from './EditQuestionModal.detail';

const mockMutate = vi.fn();
const mockCloseModal = vi.fn();
const mockReset = vi.fn();

let mockQuizDetailStoreState: any = {
  isEditQuestionModalOpen: false,
  editingQuestion: null,
  closeEditQuestionModal: mockCloseModal,
};

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'edit-question-modal-title': 'Edit Question',
      'edit-question-modal-description': 'Update the question details',
      'question-type': 'Question Type',
      'question-type-mcq': 'Multiple Choice',
      'question-type-short': 'Short Answer',
      'question-prompt': 'Question Prompt',
      'prompt-placeholder': 'Enter your question',
      'correct-answer': 'Correct Answer',
      'answer-placeholder': 'Enter correct answer',
      'add-option-button': 'Add Option',
      'add-option-placeholder': 'Option text',
      'select-correct-hint': 'Select correct answer',
      cancel: 'Cancel',
      'update-question': 'Update Question',
      updating: 'Updating...',
    };
    return translations[key] || key;
  },
}));

vi.mock('../../react-query', () => ({
  useUpdateQuestion: vi.fn(),
}));

vi.mock('../../store/quiz-detail.store', () => ({
  useQuizDetailStore: (selector: any) => selector(mockQuizDetailStoreState),
}));

describe('EditQuestionModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUpdateQuestion).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);

    mockQuizDetailStoreState = {
      isEditQuestionModalOpen: false,
      editingQuestion: null,
      closeEditQuestionModal: mockCloseModal,
    };
  });

  it('renders null when no editing question', () => {
    mockQuizDetailStoreState = {
      isEditQuestionModalOpen: true,
      editingQuestion: null,
      closeEditQuestionModal: mockCloseModal,
    };

    const { container } = render(<EditQuestionModal />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when editing MCQ question', () => {
    mockQuizDetailStoreState = {
      isEditQuestionModalOpen: true,
      editingQuestion: {
        id: 1,
        type: 'mcq',
        prompt: 'What is React?',
        position: 1,
        options: ['A library', 'A framework', 'A language'],
        correctAnswer: 0,
      },
      closeEditQuestionModal: mockCloseModal,
    };

    render(<EditQuestionModal />);
    expect(screen.getByText('Edit Question')).toBeInTheDocument();
    expect(screen.getByDisplayValue('What is React?')).toBeInTheDocument();
  });

  it('renders modal when editing short answer question', () => {
    mockQuizDetailStoreState = {
      isEditQuestionModalOpen: true,
      editingQuestion: {
        id: 2,
        type: 'short',
        prompt: 'What is JSX?',
        position: 2,
        correctAnswer: 'JavaScript XML',
      },
      closeEditQuestionModal: mockCloseModal,
    };

    render(<EditQuestionModal />);
    expect(screen.getByText('Edit Question')).toBeInTheDocument();
    expect(screen.getByDisplayValue('What is JSX?')).toBeInTheDocument();
    expect(screen.getByDisplayValue('JavaScript XML')).toBeInTheDocument();
  });

  it('calls mutate with updated data on submit', async () => {
    mockQuizDetailStoreState = {
      isEditQuestionModalOpen: true,
      editingQuestion: {
        id: 1,
        type: 'short',
        prompt: 'Old prompt',
        position: 1,
        correctAnswer: 'Old answer',
      },
      closeEditQuestionModal: mockCloseModal,
    };

    render(<EditQuestionModal />);

    const promptInput = screen.getByDisplayValue('Old prompt');
    fireEvent.change(promptInput, { target: { value: 'Updated prompt' } });

    const answerInput = screen.getByDisplayValue('Old answer');
    fireEvent.change(answerInput, { target: { value: 'Updated answer' } });

    const submitButton = screen.getByRole('button', { name: /Update Question/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: 1,
          data: {
            prompt: 'Updated prompt',
            correctAnswer: 'Updated answer',
            position: 1,
            options: undefined,
          },
        },
        expect.any(Object),
      );
    });
  });

  it('closes modal after successful update', async () => {
    mockQuizDetailStoreState = {
      isEditQuestionModalOpen: true,
      editingQuestion: {
        id: 1,
        type: 'short',
        prompt: 'Old prompt',
        position: 1,
        correctAnswer: 'Old answer',
      },
      closeEditQuestionModal: mockCloseModal,
    };

    render(<EditQuestionModal />);

    const promptInput = screen.getByDisplayValue('Old prompt');
    fireEvent.change(promptInput, { target: { value: 'Updated prompt' } });

    const submitButton = screen.getByRole('button', { name: /Update Question/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });

    const mutateCallArgs = mockMutate.mock.calls[0];
    const options = mutateCallArgs[1];
    if (options?.onSuccess) {
      options.onSuccess();
    }

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('calls closeModal when cancel button clicked', () => {
    mockQuizDetailStoreState = {
      isEditQuestionModalOpen: true,
      editingQuestion: {
        id: 1,
        type: 'short',
        prompt: 'Test',
        position: 1,
        correctAnswer: 'Answer',
      },
      closeEditQuestionModal: mockCloseModal,
    };

    render(<EditQuestionModal />);
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('disables form when mutation is pending', () => {
    mockQuizDetailStoreState = {
      isEditQuestionModalOpen: true,
      editingQuestion: {
        id: 1,
        type: 'short',
        prompt: 'Test',
        position: 1,
        correctAnswer: 'Answer',
      },
      closeEditQuestionModal: mockCloseModal,
    };

    vi.mocked(useUpdateQuestion).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);

    render(<EditQuestionModal />);

    const submitButton = screen.getByRole('button', { name: /Updating/i });
    expect(submitButton).toBeDisabled();
  });
});
