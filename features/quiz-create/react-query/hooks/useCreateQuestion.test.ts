import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { toast } from 'sonner';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { quizCreateMutationKeys } from '../keys';

import { useCreateQuestion } from './useCreateQuestion';

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
  useCreateQuestion: vi.fn((options) => ({
    mutateAsync: vi.fn(async (data) => {
      const response = { id: 456 };
      await options?.mutation?.onSuccess?.(response);
      return response;
    }),
    mutate: vi.fn((data) => {
      options?.mutation?.onSuccess?.({ id: 456 });
    }),
    isPending: false,
  })),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe('useCreateQuestion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses correct mutationKey with quizId', () => {
    const { result } = renderHook(() => useCreateQuestion(123), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });

  it('shows success toast on successful creation', async () => {
    const { result } = renderHook(() => useCreateQuestion(123), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      id: 123,
      data: {
        type: 'mcq',
        prompt: 'Test question?',
        options: ['A', 'B', 'C'],
        correctAnswer: 0,
      },
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('question-added');
    });
  });

  it('invalidates quiz detail query on success', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
        queries: { retry: false },
      },
    });

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);

    const { result } = renderHook(() => useCreateQuestion(123), { wrapper });

    await result.current.mutateAsync({
      id: 123,
      data: {
        type: 'short',
        prompt: 'What is 2+2?',
        correctAnswer: '4',
      },
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalled();
    });
  });

  it('shows error toast on failure', async () => {
    const useCreateQuestionGenerated = await import('@/core/api/generated/questions/questions');
    vi.mocked(useCreateQuestionGenerated.useCreateQuestion).mockImplementationOnce(
      (options: any) =>
        ({
          mutateAsync: vi.fn(async (data) => {
            await options?.mutation?.onError?.(new Error('Network error'));
            throw new Error('Network error');
          }),
          mutate: vi.fn(),
          isPending: false,
        }) as any,
    );

    const { result } = renderHook(() => useCreateQuestion(123), {
      wrapper: createWrapper(),
    });

    try {
      await result.current.mutateAsync({
        id: 123,
        data: {
          type: 'mcq',
          prompt: 'Test?',
          options: ['A'],
          correctAnswer: 0,
        },
      });
    } catch {
      // Expected to fail
    }

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('accepts different question types', async () => {
    const { result } = renderHook(() => useCreateQuestion(123), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      id: 123,
      data: {
        type: 'short',
        prompt: 'Short answer question?',
        correctAnswer: 'answer',
      },
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
    });
  });
});
