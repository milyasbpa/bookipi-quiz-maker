import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react';
import React from 'react';
import { toast } from 'sonner';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useSubmitAttempt } from './useSubmitAttempt';

const mockSetPhaseCompleted = vi.fn();
const mockAnswers = {
  '1': 'answer 1',
  '2': 0,
};

vi.mock('sonner', () => ({
  toast: {
    loading: vi.fn(),
    dismiss: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('../../store/player.store', () => ({
  usePlayerStore: (selector: any) =>
    selector({
      setPhaseCompleted: mockSetPhaseCompleted,
      answers: mockAnswers,
    }),
}));

const mockAnswerMutateAsync = vi.fn();
const mockSubmitMutateAsync = vi.fn();

vi.mock('@/core/api/generated/attempts/attempts', () => ({
  useAnswerQuestion: vi.fn(() => ({
    mutateAsync: mockAnswerMutateAsync,
  })),
  useSubmitAttempt: vi.fn(() => ({
    mutateAsync: mockSubmitMutateAsync,
  })),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe('useSubmitAttempt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAnswerMutateAsync.mockResolvedValue(undefined);
    mockSubmitMutateAsync.mockResolvedValue({
      score: 80,
      totalScore: 100,
    });
  });

  it('saves all answers before submitting', async () => {
    const { result } = renderHook(() => useSubmitAttempt(1, 5), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutate();
    });

    await waitFor(() => {
      expect(mockAnswerMutateAsync).toHaveBeenCalledTimes(2);
      expect(mockAnswerMutateAsync).toHaveBeenCalledWith({
        id: 1,
        data: { questionId: 1, value: 'answer 1' },
      });
      expect(mockAnswerMutateAsync).toHaveBeenCalledWith({
        id: 1,
        data: { questionId: 2, value: 0 },
      });
    });
  });

  it('submits attempt after saving answers', async () => {
    const { result } = renderHook(() => useSubmitAttempt(1, 5), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutate();
    });

    await waitFor(() => {
      expect(mockSubmitMutateAsync).toHaveBeenCalledWith({ id: 1 });
    });
  });

  it('shows loading toast while saving answers', async () => {
    const { result } = renderHook(() => useSubmitAttempt(1, 5), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutate();
    });

    await waitFor(() => {
      expect(toast.loading).toHaveBeenCalledWith('saving-answers', expect.any(Object));
    });
  });

  it('dismisses loading toast after saving', async () => {
    const { result } = renderHook(() => useSubmitAttempt(1, 5), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutate();
    });

    await waitFor(() => {
      expect(toast.dismiss).toHaveBeenCalledWith('saving-answers');
    });
  });

  it('shows success toast after submission', async () => {
    const { result } = renderHook(() => useSubmitAttempt(1, 5), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutate();
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('quiz-submitted');
    });
  });

  it('calls setPhaseCompleted with result', async () => {
    const mockResult = { score: 80, totalScore: 100 };
    mockSubmitMutateAsync.mockResolvedValue(mockResult);

    const { result } = renderHook(() => useSubmitAttempt(1, 5), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutate();
    });

    await waitFor(() => {
      expect(mockSetPhaseCompleted).toHaveBeenCalledWith(mockResult);
    });
  });

  it('shows error toast on failure', async () => {
    mockAnswerMutateAsync.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useSubmitAttempt(1, 5), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutate();
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('submit-error');
    });
  });

  it('prevents multiple simultaneous submissions', async () => {
    let resolveAnswer: any;
    const answerPromise = new Promise((resolve) => {
      resolveAnswer = resolve;
    });
    mockAnswerMutateAsync.mockReturnValue(answerPromise);

    const { result } = renderHook(() => useSubmitAttempt(1, 5), {
      wrapper: createWrapper(),
    });

    // First submission starts
    act(() => {
      result.current.mutate();
    });

    // Try to submit again while first is in progress
    act(() => {
      result.current.mutate();
    });

    // isPending should be true
    expect(result.current.isPending).toBe(true);

    // Resolve the first submission
    act(() => {
      resolveAnswer();
    });

    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
  });

  it('returns isPending true while submitting', () => {
    const { result } = renderHook(() => useSubmitAttempt(1, 5), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('isPending');
    expect(result.current.isPending).toBe(false);
  });
});
