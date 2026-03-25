import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { SubmitResult } from '@/core/api/generated/quizMakerAPI.schemas';

type PlayerPhase = 'playing' | 'completed';

interface AntiCheatEvent {
  type: 'blur' | 'focus' | 'paste';
  timestamp: string;
}

interface PlayerStore {
  // Quiz state
  attemptId: number | null;
  quizId: number | null;
  currentQuestionIndex: number;
  answers: Record<number, string>; // questionId -> answer

  // Phase management
  phase: PlayerPhase;
  submitResult: SubmitResult | null;

  // Timer state
  remainingSeconds: number | null;

  // Anti-cheat
  antiCheatEvents: AntiCheatEvent[];

  // Actions
  setAttemptId: (id: number | null) => void;
  setQuizId: (id: number | null) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setAnswer: (questionId: number, value: string) => void;

  goToNext: (totalQuestions: number) => void;
  goToPrevious: () => void;

  // Phase actions
  setPhaseCompleted: (result: SubmitResult) => void;
  setPhasePlayin: () => void;

  setRemainingSeconds: (seconds: number | null) => void;

  addAntiCheatEvent: (event: AntiCheatEvent) => void;
  clearAntiCheatEvents: () => void;

  resetPlayer: () => void;
}

export const usePlayerStore = create<PlayerStore>()(
  devtools(
    (set, _get) => ({
      attemptId: null,
      quizId: null,
      currentQuestionIndex: 0,
      answers: {},
      phase: 'playing',
      submitResult: null,
      remainingSeconds: null,
      antiCheatEvents: [],

      setAttemptId: (id) => set({ attemptId: id }),
      setQuizId: (id) => set({ quizId: id }),
      setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
      setAnswer: (questionId, value) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: value },
        })),

      goToNext: (totalQuestions) =>
        set((state) => ({
          currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, totalQuestions - 1),
        })),

      goToPrevious: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
        })),

      setPhaseCompleted: (result) => set({ phase: 'completed', submitResult: result }),

      setPhasePlayin: () => set({ phase: 'playing', submitResult: null }),

      setRemainingSeconds: (seconds) => set({ remainingSeconds: seconds }),

      addAntiCheatEvent: (event) =>
        set((state) => ({
          antiCheatEvents: [...state.antiCheatEvents, event],
        })),

      clearAntiCheatEvents: () => set({ antiCheatEvents: [] }),

      resetPlayer: () =>
        set({
          attemptId: null,
          quizId: null,
          currentQuestionIndex: 0,
          answers: {},
          phase: 'playing',
          submitResult: null,
          remainingSeconds: null,
          antiCheatEvents: [],
        }),
    }),
    { name: 'QuizPlayerStore' },
  ),
);
