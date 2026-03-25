import { describe, expect, it, beforeEach } from 'vitest';

import { useQuizListStore } from './quiz-list.store';

describe('useQuizListStore', () => {
  beforeEach(() => {
    const store = useQuizListStore.getState();
    store.setCurrentQuizId(null);
    store.setQuestionCount(0);
    store.closeEditModal();
  });

  it('initializes with correct default values', () => {
    const state = useQuizListStore.getState();

    expect(state.currentQuizId).toBeNull();
    expect(state.questionCount).toBe(0);
    expect(state.isEditModalOpen).toBe(false);
    expect(state.editQuizId).toBeNull();
    expect(state.editQuizData).toBeNull();
  });

  it('sets current quiz id correctly', () => {
    const { setCurrentQuizId } = useQuizListStore.getState();

    setCurrentQuizId(123);
    expect(useQuizListStore.getState().currentQuizId).toBe(123);

    setCurrentQuizId(null);
    expect(useQuizListStore.getState().currentQuizId).toBeNull();
  });

  it('sets question count correctly', () => {
    const { setQuestionCount } = useQuizListStore.getState();

    setQuestionCount(5);
    expect(useQuizListStore.getState().questionCount).toBe(5);

    setQuestionCount(0);
    expect(useQuizListStore.getState().questionCount).toBe(0);

    setQuestionCount(100);
    expect(useQuizListStore.getState().questionCount).toBe(100);
  });

  it('opens edit modal with all required data', () => {
    const { openEditModal } = useQuizListStore.getState();

    const quizData = {
      title: 'Test Quiz',
      description: 'Test Description',
      timeLimitSeconds: 300,
    };

    openEditModal(1, quizData);

    const state = useQuizListStore.getState();
    expect(state.isEditModalOpen).toBe(true);
    expect(state.editQuizId).toBe(1);
    expect(state.editQuizData).toEqual(quizData);
  });

  it('opens edit modal without optional timeLimitSeconds', () => {
    const { openEditModal } = useQuizListStore.getState();

    const quizData = {
      title: 'Test Quiz',
      description: 'Test Description',
    };

    openEditModal(2, quizData);

    const state = useQuizListStore.getState();
    expect(state.isEditModalOpen).toBe(true);
    expect(state.editQuizId).toBe(2);
    expect(state.editQuizData).toEqual(quizData);
    expect(state.editQuizData?.timeLimitSeconds).toBeUndefined();
  });

  it('closes edit modal and resets all modal-related state', () => {
    const { openEditModal, closeEditModal } = useQuizListStore.getState();

    openEditModal(1, {
      title: 'Test Quiz',
      description: 'Test Description',
      timeLimitSeconds: 300,
    });

    expect(useQuizListStore.getState().isEditModalOpen).toBe(true);

    closeEditModal();

    const state = useQuizListStore.getState();
    expect(state.isEditModalOpen).toBe(false);
    expect(state.editQuizId).toBeNull();
    expect(state.editQuizData).toBeNull();
  });

  it('handles multiple modal open/close operations correctly', () => {
    const { openEditModal, closeEditModal } = useQuizListStore.getState();

    openEditModal(1, { title: 'Quiz 1', description: 'Desc 1', timeLimitSeconds: 300 });
    expect(useQuizListStore.getState().editQuizId).toBe(1);

    closeEditModal();
    expect(useQuizListStore.getState().isEditModalOpen).toBe(false);

    openEditModal(2, { title: 'Quiz 2', description: 'Desc 2' });
    const state = useQuizListStore.getState();
    expect(state.editQuizId).toBe(2);
    expect(state.editQuizData?.title).toBe('Quiz 2');
    expect(state.editQuizData?.timeLimitSeconds).toBeUndefined();
  });

  it('preserves currentQuizId and questionCount when opening/closing modal', () => {
    const { setCurrentQuizId, setQuestionCount, openEditModal, closeEditModal } =
      useQuizListStore.getState();

    setCurrentQuizId(999);
    setQuestionCount(42);

    openEditModal(1, { title: 'Test', description: 'Test Desc' });
    closeEditModal();

    const state = useQuizListStore.getState();
    expect(state.currentQuizId).toBe(999);
    expect(state.questionCount).toBe(42);
  });

  it('allows updating question count while modal is open', () => {
    const { openEditModal, setQuestionCount } = useQuizListStore.getState();

    openEditModal(1, { title: 'Test', description: 'Test' });
    setQuestionCount(10);

    const state = useQuizListStore.getState();
    expect(state.isEditModalOpen).toBe(true);
    expect(state.questionCount).toBe(10);
  });
});
