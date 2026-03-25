import { describe, expect, it, beforeEach } from 'vitest';

import { usePlayerStore } from './player.store';

describe('usePlayerStore', () => {
  beforeEach(() => {
    const store = usePlayerStore.getState();
    store.resetPlayer();
  });

  it('initializes with correct default values', () => {
    const state = usePlayerStore.getState();

    expect(state.attemptId).toBeNull();
    expect(state.quizId).toBeNull();
    expect(state.currentQuestionIndex).toBe(0);
    expect(state.answers).toEqual({});
    expect(state.phase).toBe('playing');
    expect(state.submitResult).toBeNull();
    expect(state.remainingSeconds).toBeNull();
  });

  describe('setAttemptId', () => {
    it('sets attempt id correctly', () => {
      const { setAttemptId } = usePlayerStore.getState();

      setAttemptId(123);
      expect(usePlayerStore.getState().attemptId).toBe(123);
    });

    it('can set attempt id to null', () => {
      const { setAttemptId } = usePlayerStore.getState();

      setAttemptId(123);
      setAttemptId(null);
      expect(usePlayerStore.getState().attemptId).toBeNull();
    });
  });

  describe('setQuizId', () => {
    it('sets quiz id correctly', () => {
      const { setQuizId } = usePlayerStore.getState();

      setQuizId(456);
      expect(usePlayerStore.getState().quizId).toBe(456);
    });

    it('can set quiz id to null', () => {
      const { setQuizId } = usePlayerStore.getState();

      setQuizId(456);
      setQuizId(null);
      expect(usePlayerStore.getState().quizId).toBeNull();
    });
  });

  describe('setCurrentQuestionIndex', () => {
    it('sets question index correctly', () => {
      const { setCurrentQuestionIndex } = usePlayerStore.getState();

      setCurrentQuestionIndex(5);
      expect(usePlayerStore.getState().currentQuestionIndex).toBe(5);
    });

    it('can set index to 0', () => {
      const { setCurrentQuestionIndex } = usePlayerStore.getState();

      setCurrentQuestionIndex(5);
      setCurrentQuestionIndex(0);
      expect(usePlayerStore.getState().currentQuestionIndex).toBe(0);
    });
  });

  describe('setAnswer', () => {
    it('sets answer for a question', () => {
      const { setAnswer } = usePlayerStore.getState();

      setAnswer(1, 'Answer 1');
      expect(usePlayerStore.getState().answers).toEqual({ 1: 'Answer 1' });
    });

    it('updates existing answer', () => {
      const { setAnswer } = usePlayerStore.getState();

      setAnswer(1, 'Answer 1');
      setAnswer(1, 'Updated Answer');
      expect(usePlayerStore.getState().answers).toEqual({ 1: 'Updated Answer' });
    });

    it('handles multiple answers', () => {
      const { setAnswer } = usePlayerStore.getState();

      setAnswer(1, 'Answer 1');
      setAnswer(2, 'Answer 2');
      setAnswer(3, 'Answer 3');

      expect(usePlayerStore.getState().answers).toEqual({
        1: 'Answer 1',
        2: 'Answer 2',
        3: 'Answer 3',
      });
    });

    it('can set empty string as answer', () => {
      const { setAnswer } = usePlayerStore.getState();

      setAnswer(1, 'Initial');
      setAnswer(1, '');
      expect(usePlayerStore.getState().answers).toEqual({ 1: '' });
    });
  });

  describe('goToNext', () => {
    it('increments question index', () => {
      const { goToNext, setCurrentQuestionIndex } = usePlayerStore.getState();

      setCurrentQuestionIndex(0);
      goToNext(5);
      expect(usePlayerStore.getState().currentQuestionIndex).toBe(1);
    });

    it('does not exceed total questions - 1', () => {
      const { goToNext, setCurrentQuestionIndex } = usePlayerStore.getState();

      setCurrentQuestionIndex(4);
      goToNext(5); // Total 5 questions, max index is 4
      expect(usePlayerStore.getState().currentQuestionIndex).toBe(4);
    });

    it('handles single question quiz', () => {
      const { goToNext, setCurrentQuestionIndex } = usePlayerStore.getState();

      setCurrentQuestionIndex(0);
      goToNext(1);
      expect(usePlayerStore.getState().currentQuestionIndex).toBe(0);
    });

    it('can navigate through all questions', () => {
      const { goToNext } = usePlayerStore.getState();
      const totalQuestions = 10;

      for (let i = 0; i < totalQuestions; i++) {
        goToNext(totalQuestions);
      }

      // Should stop at last question (index 9)
      expect(usePlayerStore.getState().currentQuestionIndex).toBe(9);
    });
  });

  describe('goToPrevious', () => {
    it('decrements question index', () => {
      const { goToPrevious, setCurrentQuestionIndex } = usePlayerStore.getState();

      setCurrentQuestionIndex(2);
      goToPrevious();
      expect(usePlayerStore.getState().currentQuestionIndex).toBe(1);
    });

    it('does not go below 0', () => {
      const { goToPrevious, setCurrentQuestionIndex } = usePlayerStore.getState();

      setCurrentQuestionIndex(0);
      goToPrevious();
      expect(usePlayerStore.getState().currentQuestionIndex).toBe(0);
    });

    it('can navigate backwards multiple times', () => {
      const { goToPrevious, setCurrentQuestionIndex } = usePlayerStore.getState();

      setCurrentQuestionIndex(5);
      goToPrevious();
      goToPrevious();
      goToPrevious();
      expect(usePlayerStore.getState().currentQuestionIndex).toBe(2);
    });

    it('handles going previous from first question', () => {
      const { goToPrevious } = usePlayerStore.getState();

      goToPrevious();
      goToPrevious();
      expect(usePlayerStore.getState().currentQuestionIndex).toBe(0);
    });
  });

  describe('navigation combination', () => {
    it('can go forward then backward', () => {
      const { goToNext, goToPrevious } = usePlayerStore.getState();

      goToNext(10);
      goToNext(10);
      goToNext(10);
      expect(usePlayerStore.getState().currentQuestionIndex).toBe(3);

      goToPrevious();
      expect(usePlayerStore.getState().currentQuestionIndex).toBe(2);
    });

    it('maintains bounds during complex navigation', () => {
      const { goToNext, goToPrevious, setCurrentQuestionIndex } = usePlayerStore.getState();

      setCurrentQuestionIndex(0);
      goToPrevious(); // Should stay at 0
      expect(usePlayerStore.getState().currentQuestionIndex).toBe(0);

      goToNext(3);
      goToNext(3);
      goToNext(3);
      goToNext(3); // Should stop at 2 (last index for 3 questions)
      expect(usePlayerStore.getState().currentQuestionIndex).toBe(2);
    });
  });

  describe('setPhaseCompleted', () => {
    it('sets phase to completed with result', () => {
      const { setPhaseCompleted } = usePlayerStore.getState();

      const result = {
        score: 8,
        details: [],
      };

      setPhaseCompleted(result);

      const state = usePlayerStore.getState();
      expect(state.phase).toBe('completed');
      expect(state.submitResult).toEqual(result);
    });

    it('can update result in completed phase', () => {
      const { setPhaseCompleted } = usePlayerStore.getState();

      const result1 = { score: 5, details: [] };
      const result2 = { score: 8, details: [] };

      setPhaseCompleted(result1);
      setPhaseCompleted(result2);

      expect(usePlayerStore.getState().submitResult).toEqual(result2);
    });
  });

  describe('setPhasePlayin', () => {
    it('sets phase to playing and clears result', () => {
      const { setPhaseCompleted, setPhasePlayin } = usePlayerStore.getState();

      setPhaseCompleted({ score: 10, details: [] });
      setPhasePlayin();

      const state = usePlayerStore.getState();
      expect(state.phase).toBe('playing');
      expect(state.submitResult).toBeNull();
    });
  });

  describe('setRemainingSeconds', () => {
    it('sets remaining seconds correctly', () => {
      const { setRemainingSeconds } = usePlayerStore.getState();

      setRemainingSeconds(300);
      expect(usePlayerStore.getState().remainingSeconds).toBe(300);
    });

    it('can set to 0', () => {
      const { setRemainingSeconds } = usePlayerStore.getState();

      setRemainingSeconds(300);
      setRemainingSeconds(0);
      expect(usePlayerStore.getState().remainingSeconds).toBe(0);
    });

    it('can set to null', () => {
      const { setRemainingSeconds } = usePlayerStore.getState();

      setRemainingSeconds(300);
      setRemainingSeconds(null);
      expect(usePlayerStore.getState().remainingSeconds).toBeNull();
    });

    it('handles countdown simulation', () => {
      const { setRemainingSeconds } = usePlayerStore.getState();

      setRemainingSeconds(10);
      for (let i = 9; i >= 0; i--) {
        setRemainingSeconds(i);
      }
      expect(usePlayerStore.getState().remainingSeconds).toBe(0);
    });
  });

  describe('resetPlayer', () => {
    it('resets all state to initial values', () => {
      const {
        setAttemptId,
        setQuizId,
        setCurrentQuestionIndex,
        setAnswer,
        setPhaseCompleted,
        setRemainingSeconds,
        resetPlayer,
      } = usePlayerStore.getState();

      // Set various state
      setAttemptId(123);
      setQuizId(456);
      setCurrentQuestionIndex(5);
      setAnswer(1, 'Answer 1');
      setAnswer(2, 'Answer 2');
      setPhaseCompleted({ score: 10, details: [] });
      setRemainingSeconds(100);

      // Reset
      resetPlayer();

      const state = usePlayerStore.getState();
      expect(state.attemptId).toBeNull();
      expect(state.quizId).toBeNull();
      expect(state.currentQuestionIndex).toBe(0);
      expect(state.answers).toEqual({});
      expect(state.phase).toBe('playing');
      expect(state.submitResult).toBeNull();
      expect(state.remainingSeconds).toBeNull();
    });

    it('can be called multiple times safely', () => {
      const { setAttemptId, resetPlayer } = usePlayerStore.getState();

      setAttemptId(123);
      resetPlayer();
      resetPlayer();
      resetPlayer();

      expect(usePlayerStore.getState().attemptId).toBeNull();
    });

    it('allows fresh start after reset', () => {
      const { setAttemptId, resetPlayer } = usePlayerStore.getState();

      setAttemptId(123);
      resetPlayer();
      setAttemptId(456);

      expect(usePlayerStore.getState().attemptId).toBe(456);
    });
  });

  describe('complex scenarios', () => {
    it('handles complete quiz flow', () => {
      const { setAttemptId, setQuizId, setAnswer, goToNext, setPhaseCompleted, resetPlayer } =
        usePlayerStore.getState();

      // 1. Start quiz
      setAttemptId(1);
      setQuizId(1);

      // 2. Answer questions
      setAnswer(1, 'Answer 1');
      goToNext(3);
      setAnswer(2, 'Answer 2');
      goToNext(3);
      setAnswer(3, 'Answer 3');

      expect(usePlayerStore.getState().currentQuestionIndex).toBe(2);
      expect(Object.keys(usePlayerStore.getState().answers)).toHaveLength(3);

      // 3. Submit (complete phase)
      setPhaseCompleted({ score: 3, details: [] });
      expect(usePlayerStore.getState().phase).toBe('completed');

      // 4. Reset for new quiz
      resetPlayer();
      expect(usePlayerStore.getState().answers).toEqual({});
      expect(usePlayerStore.getState().currentQuestionIndex).toBe(0);
    });

    it('handles timed quiz', () => {
      const { setRemainingSeconds, setPhaseCompleted } = usePlayerStore.getState();

      setRemainingSeconds(60);

      // Simulate countdown
      for (let i = 59; i >= 0; i--) {
        setRemainingSeconds(i);
      }

      // Time up - submit
      setPhaseCompleted({ score: 5, details: [] });

      expect(usePlayerStore.getState().phase).toBe('completed');
      expect(usePlayerStore.getState().remainingSeconds).toBe(0);
    });

    it('preserves answers when navigating', () => {
      const { setAnswer, goToNext, goToPrevious } = usePlayerStore.getState();

      setAnswer(1, 'Q1 Answer');
      goToNext(5);
      setAnswer(2, 'Q2 Answer');
      goToNext(5);
      setAnswer(3, 'Q3 Answer');

      goToPrevious();
      goToPrevious();

      const answers = usePlayerStore.getState().answers;
      expect(answers[1]).toBe('Q1 Answer');
      expect(answers[2]).toBe('Q2 Answer');
      expect(answers[3]).toBe('Q3 Answer');
    });
  });
});
