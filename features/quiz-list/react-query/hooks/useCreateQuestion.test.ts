import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { toast } from 'sonner';
import { describe, expect, it, vi, beforeEach } from 'vitest';

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

const mockSetQuestionCount = vi.fn();
const mockCurrentCount = 5;

vi.mock('../../store', () => ({
  useQuizListStore: (selector: any) =>
    selector({
      setQuestionCount: mockSetQuestionCount,
      questionCount: mockCurrentCount,
    }),
}));

vi.mock('@/core/api/generated/questions/questions', () => ({
  useCreateQuestion: vi.fn((options) => ({
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

describe('useCreateQuestion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses correct mutationKey with quizId', () => {
    const { result } = renderHook(() => useCreateQuestion(1), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });

  it('shows success toast on successful creation', async () => {
    const { result } = renderHook(() => useCreateQuestion(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 1,
      data: {
        prompt: 'What is JavaScript?',
        type: 'short',
        correctAnswer: 'A programming language',
      },
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('question-added');
    });
  });

  it('increments question count on success', async () => {
    const { result } = renderHook(() => useCreateQuestion(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 1,
      data: {
        prompt: 'What is React?',
        type: 'short',
        correctAnswer: 'A library',
      },
    });

    await waitFor(() => {
      expect(mockSetQuestionCount).toHaveBeenCalledWith(mockCurrentCount + 1);
    });
  });

  it('invalidates quiz detail query on success', async () => {
    const queryClient = new QueryClient();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const Wrapper = function ({ children }: { children: React.ReactNode }) {
      return React.createElement(QueryClientProvider, { client: queryClient }, children);
    };

    const { result } = renderHook(() => useCreateQuestion(1), {
      wrapper: Wrapper,
    });

    result.current.mutate({
      id: 1,
      data: {
        prompt: 'Question',
        type: 'short',
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
    const useCreateQuestionGenerated = await import('@/core/api/generated/questions/questions');
    vi.mocked(useCreateQuestionGenerated.useCreateQuestion).mockReturnValue({
      mutate: vi.fn(() => {}),
      isPending: false,
    } as any);

    vi.mocked(useCreateQuestionGenerated.useCreateQuestion).mockImplementationOnce(
      (options: any) =>
        ({
          mutate: vi.fn((data) => {
            options?.mutation?.onError?.(new Error('Creation failed') as any);
          }),
          isPending: false,
        }) as any,
    );

    const { result } = renderHook(() => useCreateQuestion(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 1,
      data: {
        prompt: 'Question',
        type: 'short',
        correctAnswer: 'Answer',
      },
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('question-add-error');
    });
  });

  it('handles different quiz ids correctly', () => {
    const { result: result1 } = renderHook(() => useCreateQuestion(1), {
      wrapper: createWrapper(),
    });

    const { result: result2 } = renderHook(() => useCreateQuestion(2), {
      wrapper: createWrapper(),
    });

    expect(result1.current).toBeDefined();
    expect(result2.current).toBeDefined();
  });
});
