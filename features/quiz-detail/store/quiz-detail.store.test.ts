import { describe, it, expect, beforeEach } from 'vitest';

import type { Question } from '@/core/api/generated/quizMakerAPI.schemas';

import { useQuizDetailStore } from './quiz-detail.store';

describe('useQuizDetailStore', () => {
  beforeEach(() => {
    const store = useQuizDetailStore.getState();
    store.closeAddQuestionModal();
    store.closeEditQuestionModal();
    store.closeEditQuizModal();
  });

  describe('Add Question Modal', () => {
    it('initializes with closed modal', () => {
      const { isAddQuestionModalOpen } = useQuizDetailStore.getState();
      expect(isAddQuestionModalOpen).toBe(false);
    });

    it('opens add question modal', () => {
      const { openAddQuestionModal } = useQuizDetailStore.getState();
      openAddQuestionModal();

      const { isAddQuestionModalOpen } = useQuizDetailStore.getState();
      expect(isAddQuestionModalOpen).toBe(true);
    });

    it('closes add question modal', () => {
      const { openAddQuestionModal, closeAddQuestionModal } = useQuizDetailStore.getState();
      openAddQuestionModal();
      closeAddQuestionModal();

      const { isAddQuestionModalOpen } = useQuizDetailStore.getState();
      expect(isAddQuestionModalOpen).toBe(false);
    });
  });

  describe('Edit Question Modal', () => {
    const mockQuestion: Question = {
      id: 1,
      type: 'mcq',
      prompt: 'Test Question',
      options: ['A', 'B', 'C'],
      correctAnswer: 0,
    };

    it('initializes with closed modal and null question', () => {
      const { isEditQuestionModalOpen, editingQuestion } = useQuizDetailStore.getState();
      expect(isEditQuestionModalOpen).toBe(false);
      expect(editingQuestion).toBeNull();
    });

    it('opens edit question modal with question data', () => {
      const { openEditQuestionModal } = useQuizDetailStore.getState();
      openEditQuestionModal(mockQuestion);

      const { isEditQuestionModalOpen, editingQuestion } = useQuizDetailStore.getState();
      expect(isEditQuestionModalOpen).toBe(true);
      expect(editingQuestion).toEqual(mockQuestion);
    });

    it('closes edit question modal and clears question data', () => {
      const { openEditQuestionModal, closeEditQuestionModal } = useQuizDetailStore.getState();
      openEditQuestionModal(mockQuestion);
      closeEditQuestionModal();

      const { isEditQuestionModalOpen, editingQuestion } = useQuizDetailStore.getState();
      expect(isEditQuestionModalOpen).toBe(false);
      expect(editingQuestion).toBeNull();
    });
  });

  describe('Edit Quiz Modal', () => {
    const mockQuizData = {
      title: 'Test Quiz',
      description: 'Test Description',
      timeLimitSeconds: 300,
    };

    it('initializes with closed modal and null quiz data', () => {
      const { isEditQuizModalOpen, editQuizData } = useQuizDetailStore.getState();
      expect(isEditQuizModalOpen).toBe(false);
      expect(editQuizData).toBeNull();
    });

    it('opens edit quiz modal with quiz data', () => {
      const { openEditQuizModal } = useQuizDetailStore.getState();
      openEditQuizModal(mockQuizData);

      const { isEditQuizModalOpen, editQuizData } = useQuizDetailStore.getState();
      expect(isEditQuizModalOpen).toBe(true);
      expect(editQuizData).toEqual(mockQuizData);
    });

    it('closes edit quiz modal and clears quiz data', () => {
      const { openEditQuizModal, closeEditQuizModal } = useQuizDetailStore.getState();
      openEditQuizModal(mockQuizData);
      closeEditQuizModal();

      const { isEditQuizModalOpen, editQuizData } = useQuizDetailStore.getState();
      expect(isEditQuizModalOpen).toBe(false);
      expect(editQuizData).toBeNull();
    });

    it('handles quiz data without timeLimitSeconds', () => {
      const quizDataWithoutTime = {
        title: 'Test Quiz',
        description: 'Test Description',
      };

      const { openEditQuizModal } = useQuizDetailStore.getState();
      openEditQuizModal(quizDataWithoutTime);

      const { editQuizData } = useQuizDetailStore.getState();
      expect(editQuizData).toEqual(quizDataWithoutTime);
      expect(editQuizData?.timeLimitSeconds).toBeUndefined();
    });
  });
});
