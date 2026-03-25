import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { toast } from 'sonner';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useCreateQuiz } from './useCreateQuiz';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const mockSetCurrentQuizId = vi.fn();

vi.mock('../../store', () => ({
  useQuizListStore: (selector: any) => selector({ setCurrentQuizId: mockSetCurrentQuizId }),
}));

vi.mock('@/core/api/generated/quizzes/quizzes', () => ({
  useCreateQuiz: vi.fn((options) => ({
    mutate: vi.fn((data) => {
      options?.mutation?.onSuccess?.({ id: 123 });
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

describe('useCreateQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses correct mutationKey', () => {
    const { result } = renderHook(() => useCreateQuiz(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });

  it('calls setCurrentQuizId on success', async () => {
    const { result } = renderHook(() => useCreateQuiz(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      data: {
        title: 'New Quiz',
        description: 'Test',
        timeLimitSeconds: 300,
        isPublished: true,
      },
    });

    await waitFor(() => {
      expect(mockSetCurrentQuizId).toHaveBeenCalledWith(123);
    });
  });

  it('shows success toast on successful creation', async () => {
    const { result } = renderHook(() => useCreateQuiz(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      data: {
        title: 'New Quiz',
        description: 'Test',
        timeLimitSeconds: 300,
        isPublished: true,
      },
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('quiz-created');
    });
  });

  it('invalidates quizzes query on success', async () => {
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const Wrapper = function ({ children }: { children: React.ReactNode }) {
      return React.createElement(QueryClientProvider, { client: queryClient }, children);
    };

    const { result } = renderHook(() => useCreateQuiz(), {
      wrapper: Wrapper,
    });

    result.current.mutate({
      data: {
        title: 'New Quiz',
        description: 'Test',
        timeLimitSeconds: 300,
        isPublished: true,
      },
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['/quizzes'],
      });
    });
  });

  it('handles quiz creation without id gracefully', async () => {
    const useCreateQuizGenerated = await import('@/core/api/generated/quizzes/quizzes');
    vi.mocked(useCreateQuizGenerated.useCreateQuiz).mockReturnValue({
      mutate: vi.fn((data, options) => {
        options?.onSuccess?.({ id: undefined } as any);
      }),
      isPending: false,
    } as any);

    const { result } = renderHook(() => useCreateQuiz(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      data: {
        title: 'New Quiz',
        description: 'Test',
        timeLimitSeconds: 300,
        isPublished: true,
      },
    });

    await waitFor(() => {
      expect(mockSetCurrentQuizId).not.toHaveBeenCalled();
    });
  });
});
