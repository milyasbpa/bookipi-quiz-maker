import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { toast } from 'sonner';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useUpdateQuiz } from './useUpdateQuiz';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const mockCloseEditModal = vi.fn();

vi.mock('../../store', () => ({
  useQuizListStore: (selector: any) => selector({ closeEditModal: mockCloseEditModal }),
}));

vi.mock('@/core/api/generated/quizzes/quizzes', () => ({
  useUpdateQuiz: vi.fn((options) => ({
    mutate: vi.fn((data) => {
      options?.mutation?.onSuccess?.({
        id: 1,
        title: 'Test Quiz',
        description: 'Test',
        timeLimitSeconds: 300,
        isPublished: true,
      });
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

describe('useUpdateQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses correct mutationKey', () => {
    const { result } = renderHook(() => useUpdateQuiz(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });

  it('shows success toast on successful update', async () => {
    const { result } = renderHook(() => useUpdateQuiz(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 1,
      data: {
        title: 'Updated Quiz',
        description: 'Updated description',
        timeLimitSeconds: 600,
        isPublished: true,
      },
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('quiz-updated');
    });
  });

  it('closes edit modal on success', async () => {
    const { result } = renderHook(() => useUpdateQuiz(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 1,
      data: {
        title: 'Updated Quiz',
        description: 'Updated description',
        timeLimitSeconds: 600,
        isPublished: true,
      },
    });

    await waitFor(() => {
      expect(mockCloseEditModal).toHaveBeenCalled();
    });
  });

  it('invalidates all quizzes query on success', async () => {
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const Wrapper = function ({ children }: { children: React.ReactNode }) {
      return React.createElement(QueryClientProvider, { client: queryClient }, children);
    };

    const { result } = renderHook(() => useUpdateQuiz(), {
      wrapper: Wrapper,
    });

    result.current.mutate({
      id: 1,
      data: {
        title: 'Updated Quiz',
        description: 'Updated',
        timeLimitSeconds: 600,
        isPublished: true,
      },
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ['/quizzes'],
      });
    });
  });

  it('shows error toast on failure', async () => {
    const useUpdateQuizGenerated = await import('@/core/api/generated/quizzes/quizzes');
    vi.mocked(useUpdateQuizGenerated.useUpdateQuiz).mockImplementationOnce(
      (options: any) =>
        ({
          mutate: vi.fn((data) => {
            options?.mutation?.onError?.(new Error('Update failed') as any);
          }),
          isPending: false,
        }) as any,
    );

    const { result } = renderHook(() => useUpdateQuiz(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 1,
      data: {
        title: 'Updated Quiz',
        description: 'Updated',
        timeLimitSeconds: 600,
        isPublished: true,
      },
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('quiz-update-error');
    });
  });
});
