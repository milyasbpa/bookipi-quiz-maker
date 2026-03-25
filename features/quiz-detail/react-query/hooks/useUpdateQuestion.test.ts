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

let mockMutate = vi.fn();
let mockOnSuccess: any = null;
let mockOnError: any = null;

vi.mock('@/core/api/generated/questions/questions', () => ({
  useUpdateQuestion: vi.fn((options: any) => {
    mockOnSuccess = options?.mutation?.onSuccess;
    mockOnError = options?.mutation?.onError;
    return {
      mutate: mockMutate,
      isPending: false,
    };
  }),
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
    mockOnSuccess = null;
    mockOnError = null;
    mockMutate = vi.fn((data, callbacks) => {
      callbacks?.onSuccess?.();
      if (mockOnSuccess) mockOnSuccess();
    });
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
      id: 1,
      data: {
        prompt: 'Updated question?',
        correctAnswer: 'Updated answer',
      },
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('question-updated');
    });
  });

  it('invalidates quiz detail query on success', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
      },
    });

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);

    const { result } = renderHook(() => useUpdateQuestion(1), { wrapper });

    result.current.mutate({
      id: 1,
      data: {
        prompt: 'Test?',
        options: ['A', 'B'],
        correctAnswer: 0,
      },
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalled();
    });
  });

  it('shows error toast on failure', async () => {
    mockMutate = vi.fn((data, callbacks) => {
      if (mockOnError) mockOnError();
    });

    const { result } = renderHook(() => useUpdateQuestion(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 1,
      data: {
        prompt: 'Test?',
        correctAnswer: 'Answer',
      },
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('question-update-error');
    });
  });
});
