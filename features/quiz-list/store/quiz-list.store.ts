import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface QuizListStore {
  // Current quiz being edited
  currentQuizId: number | null;
  setCurrentQuizId: (id: number | null) => void;

  questionCount: number;
  setQuestionCount: (count: number) => void;

  // Edit modal state
  isEditModalOpen: boolean;
  editQuizId: number | null;
  editQuizData: { title: string; description: string; timeLimitSeconds?: number } | null;

  // Edit modal actions
  openEditModal: (quizId: number, quizData: { title: string; description: string; timeLimitSeconds?: number }) => void;
  closeEditModal: () => void;
}

export const useQuizListStore = create<QuizListStore>()(
  devtools(
    (set) => ({
      currentQuizId: null,
      questionCount: 0,
      isEditModalOpen: false,
      editQuizId: null,
      editQuizData: null,

      setCurrentQuizId: (id) => set({ currentQuizId: id }),
      setQuestionCount: (count) => set({ questionCount: count }),

      openEditModal: (quizId, quizData) =>
        set({
          isEditModalOpen: true,
          editQuizId: quizId,
          editQuizData: quizData,
        }),
      closeEditModal: () =>
        set({
          isEditModalOpen: false,
          editQuizId: null,
          editQuizData: null,
        }),
    }),
    { name: 'QuizListStore' },
  ),
);
