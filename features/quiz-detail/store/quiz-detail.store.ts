'use client';

import { create } from 'zustand';

import type { Question } from '@/core/api/generated/quizMakerAPI.schemas';

interface QuizDetailStore {
  // Add Question Modal
  isAddQuestionModalOpen: boolean;
  openAddQuestionModal: () => void;
  closeAddQuestionModal: () => void;

  // Edit Question Modal
  isEditQuestionModalOpen: boolean;
  editingQuestion: Question | null;
  openEditQuestionModal: (question: Question) => void;
  closeEditQuestionModal: () => void;

  // Edit Quiz Modal
  isEditQuizModalOpen: boolean;
  editQuizData: { title: string; description: string; timeLimitSeconds?: number } | null;
  openEditQuizModal: (quizData: {
    title: string;
    description: string;
    timeLimitSeconds?: number;
  }) => void;
  closeEditQuizModal: () => void;
}

export const useQuizDetailStore = create<QuizDetailStore>((set) => ({
  // Add Question Modal
  isAddQuestionModalOpen: false,
  openAddQuestionModal: () => set({ isAddQuestionModalOpen: true }),
  closeAddQuestionModal: () => set({ isAddQuestionModalOpen: false }),

  // Edit Question Modal
  isEditQuestionModalOpen: false,
  editingQuestion: null,
  openEditQuestionModal: (question) =>
    set({ isEditQuestionModalOpen: true, editingQuestion: question }),
  closeEditQuestionModal: () => set({ isEditQuestionModalOpen: false, editingQuestion: null }),

  // Edit Quiz Modal
  isEditQuizModalOpen: false,
  editQuizData: null,
  openEditQuizModal: (quizData) => set({ isEditQuizModalOpen: true, editQuizData: quizData }),
  closeEditQuizModal: () => set({ isEditQuizModalOpen: false, editQuizData: null }),
}));
