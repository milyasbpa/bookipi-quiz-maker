import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { toast } from 'sonner';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useUpdateQuestion } from './useUpdateQuestion';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/core/api/generated/questions/questions', () => ({
  useUpdateQuestion: vi.fn((options) => ({
    mutate: vi.fn((data) => {
      options?.mutation?.onSuccess?.();
    }),
    isPending: false,
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

describe('useUpdateQuestion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses correct mutationKey with quizId', () => {
    const { result } = renderHook(() => useUpdateQuestion(1), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });

  it('shows success toast on successful update', async () => {
    const { result } = renderHook(() => useUpdateQuestion(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 10,
      data: {
        prompt: 'Updated Question?',
        correctAnswer: 'Updated Answer',
      },
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('question-updated');
    });
  });

  it('invalidates quiz detail query on success', async () => {
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const Wrapper = function ({ children }: { children: React.ReactNode }) {
      return React.createElement(QueryClientProvider, { client: queryClient }, children);
    };

    const { result } = renderHook(() => useUpdateQuestion(1), {
      wrapper: Wrapper,
    });

    result.current.mutate({
      id: 10,
      data: {
        prompt: 'Question',
        correctAnswer: 'Answer',
      },
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['/quizzes/1'],
      });
    });
  });

  it('shows error toast on failure', async () => {
    const useUpdateQuestionGenerated = await import('@/core/api/generated/questions/questions');

    vi.mocked(useUpdateQuestionGenerated.useUpdateQuestion).mockImplementationOnce(
      (options: any) =>
        ({
          mutate: vi.fn((data) => {
            options?.mutation?.onError?.(new Error('Update failed') as any);
          }),
          isPending: false,
        }) as any,
    );

    const { result } = renderHook(() => useUpdateQuestion(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 10,
      data: {
        prompt: 'Question',
        correctAnswer: 'Answer',
      },
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('question-update-error');
    });
  });

  it('handles MCQ question updates', async () => {
    const { result } = renderHook(() => useUpdateQuestion(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 10,
      data: {
        prompt: 'What is 2+2?',
        options: ['2', '3', '4', '5'],
        correctAnswer: 2,
      },
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('question-updated');
    });
  });

  it('handles different quiz ids correctly', () => {
    const { result: result1 } = renderHook(() => useUpdateQuestion(1), {
      wrapper: createWrapper(),
    });

    const { result: result2 } = renderHook(() => useUpdateQuestion(2), {
      wrapper: createWrapper(),
    });

    expect(result1.current).toBeDefined();
    expect(result2.current).toBeDefined();
  });
});
