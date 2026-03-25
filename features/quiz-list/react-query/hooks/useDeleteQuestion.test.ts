import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { toast } from 'sonner';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useDeleteQuestion } from './useDeleteQuestion';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const mockSetQuestionCount = vi.fn();
let mockCurrentCount = 5;

vi.mock('../../store', () => ({
  useQuizListStore: (selector: any) => {
    const state = {
      setQuestionCount: mockSetQuestionCount,
      get questionCount() {
        return mockCurrentCount;
      },
    };
    return selector(state);
  },
}));

vi.mock('@/core/api/generated/questions/questions', () => ({
  useDeleteQuestion: vi.fn((options) => ({
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

describe('useDeleteQuestion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrentCount = 5;
  });

  it('uses correct mutationKey with quizId', () => {
    const { result } = renderHook(() => useDeleteQuestion(1), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });

  it('shows success toast on successful deletion', async () => {
    const { result } = renderHook(() => useDeleteQuestion(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: 10 });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('question-deleted');
    });
  });

  it('decrements question count on success', async () => {
    const { result } = renderHook(() => useDeleteQuestion(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: 10 });

    await waitFor(() => {
      expect(mockSetQuestionCount).toHaveBeenCalledWith(mockCurrentCount - 1);
    });
  });

  it('invalidates quiz detail query on success', async () => {
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const Wrapper = function ({ children }: { children: React.ReactNode }) {
      return React.createElement(QueryClientProvider, { client: queryClient }, children);
    };

    const { result } = renderHook(() => useDeleteQuestion(1), {
      wrapper: Wrapper,
    });

    result.current.mutate({ id: 10 });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['/quizzes/1'],
      });
    });
  });

  it('shows error toast on failure', async () => {
    const useDeleteQuestionGenerated = await import('@/core/api/generated/questions/questions');
    vi.mocked(useDeleteQuestionGenerated.useDeleteQuestion).mockImplementationOnce(
      (options: any) =>
        ({
          mutate: vi.fn((data) => {
            options?.mutation?.onError?.(new Error('Deletion failed') as any);
          }),
          isPending: false,
        }) as any,
    );

    const { result } = renderHook(() => useDeleteQuestion(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: 10 });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('question-delete-error');
    });
  });

  it('handles different quiz ids correctly', () => {
    const { result: result1 } = renderHook(() => useDeleteQuestion(1), {
      wrapper: createWrapper(),
    });

    const { result: result2 } = renderHook(() => useDeleteQuestion(2), {
      wrapper: createWrapper(),
    });

    expect(result1.current).toBeDefined();
    expect(result2.current).toBeDefined();
  });

  it('does not decrement below zero', async () => {
    mockCurrentCount = 0;

    const { result } = renderHook(() => useDeleteQuestion(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: 10 });

    await waitFor(() => {
      expect(mockSetQuestionCount).toHaveBeenCalledWith(0);
    });
  });
});
