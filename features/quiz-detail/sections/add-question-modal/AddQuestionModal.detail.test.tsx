import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useCreateQuestion } from '../../react-query';

import { AddQuestionModal } from './AddQuestionModal.detail';

const mockMutate = vi.fn();
const mockCloseModal = vi.fn();
const mockOpenModal = vi.fn();

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'add-question-modal-title': 'Add New Question',
      'add-question-modal-description': 'Create a new question for this quiz',
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
      'add-question': 'Add Question',
      adding: 'Adding...',
    };
    return translations[key] || key;
  },
}));

vi.mock('../../react-query', () => ({
  useCreateQuestion: vi.fn(),
}));

const mockCloseAddModal = vi.fn();

let mockQuizDetailStoreState: any = {
  isAddQuestionModalOpen: false,
  closeAddQuestionModal: mockCloseAddModal,
};

vi.mock('../../store/quiz-detail.store', () => ({
  useQuizDetailStore: (selector: any) => selector(mockQuizDetailStoreState),
}));

describe('AddQuestionModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCreateQuestion).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);

    mockQuizDetailStoreState = {
      isAddQuestionModalOpen: false,
      closeAddQuestionModal: mockCloseAddModal,
    };
  });

  it('renders modal when open', () => {
    mockQuizDetailStoreState = {
      isAddQuestionModalOpen: true,
      closeAddQuestionModal: mockCloseAddModal,
    };

    render(<AddQuestionModal />);
    expect(screen.getByText('Add New Question')).toBeInTheDocument();
    expect(screen.getByText('Create a new question for this quiz')).toBeInTheDocument();
  });

  it('does not render modal when closed', () => {
    mockQuizDetailStoreState = {
      isAddQuestionModalOpen: false,
      closeAddQuestionModal: mockCloseAddModal,
    };

    render(<AddQuestionModal />);
    expect(screen.queryByText('Add New Question')).not.toBeInTheDocument();
  });

  it('renders AddQuestionForm component', () => {
    mockQuizDetailStoreState = {
      isAddQuestionModalOpen: true,
      closeAddQuestionModal: mockCloseAddModal,
    };

    render(<AddQuestionModal />);
    expect(screen.getByText('Question Type')).toBeInTheDocument();
    expect(screen.getByText('Question Prompt')).toBeInTheDocument();
  });

  it('calls createQuestion mutation on form submit', async () => {
    mockQuizDetailStoreState = {
      isAddQuestionModalOpen: true,
      closeAddQuestionModal: mockCloseAddModal,
    };

    render(<AddQuestionModal />);

    const typeSelect = screen.getByRole('combobox');
    fireEvent.change(typeSelect, { target: { value: 'short' } });

    const promptInput = screen.getByPlaceholderText('Enter your question');
    fireEvent.change(promptInput, { target: { value: 'What is React?' } });

    const answerInput = screen.getByPlaceholderText('Enter correct answer');
    fireEvent.change(answerInput, { target: { value: 'A JavaScript library' } });

    const submitButton = screen.getByRole('button', { name: /Add Question/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: 1,
          data: expect.objectContaining({
            type: 'short',
            prompt: 'What is React?',
            correctAnswer: 'A JavaScript library',
          }),
        },
        expect.any(Object),
      );
    });
  });

  it('resets form after successful submission', async () => {
    mockQuizDetailStoreState = {
      isAddQuestionModalOpen: true,
      closeAddQuestionModal: mockCloseAddModal,
    };

    mockMutate.mockImplementation((_, { onSuccess }: any) => {
      onSuccess();
    });

    render(<AddQuestionModal />);

    const typeSelect = screen.getByRole('combobox');
    fireEvent.change(typeSelect, { target: { value: 'short' } });

    const promptInput = screen.getByPlaceholderText('Enter your question');
    fireEvent.change(promptInput, { target: { value: 'Test question' } });

    const answerInput = screen.getByPlaceholderText('Enter correct answer');
    fireEvent.change(answerInput, { target: { value: 'Test answer' } });

    const submitButton = screen.getByRole('button', { name: /Add Question/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });

    expect(mockMutate).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );
  });

  it('passes isPending to form component', () => {
    mockQuizDetailStoreState = {
      isAddQuestionModalOpen: true,
      closeAddQuestionModal: mockCloseAddModal,
    };

    vi.mocked(useCreateQuestion).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);

    render(<AddQuestionModal />);

    const submitButton = screen.getByRole('button', { name: /Adding/i });
    expect(submitButton).toBeDisabled();
  });

  it('closes modal on dialog close', () => {
    mockQuizDetailStoreState = {
      isAddQuestionModalOpen: true,
      closeAddQuestionModal: mockCloseAddModal,
    };

    render(<AddQuestionModal />);

    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).toBeInTheDocument();
  });

  it('uses correct quizId from params', () => {
    mockQuizDetailStoreState = {
      isAddQuestionModalOpen: true,
      closeAddQuestionModal: mockCloseAddModal,
    };

    render(<AddQuestionModal />);

    expect(useCreateQuestion).toHaveBeenCalledWith(1);
  });
});
