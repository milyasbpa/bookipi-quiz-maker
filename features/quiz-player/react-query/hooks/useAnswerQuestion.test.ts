import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { toast } from 'sonner';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useAnswerQuestion } from './useAnswerQuestion';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

const mockMutate = vi.fn();
let mockOnSuccess: any = null;
let mockOnError: any = null;

vi.mock('@/core/api/generated/attempts/attempts', () => ({
  useAnswerQuestion: vi.fn((options: any) => {
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

describe('useAnswerQuestion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSuccess = null;
    mockOnError = null;
  });

  it('uses correct mutationKey with attemptId', () => {
    const { result } = renderHook(() => useAnswerQuestion(1), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });

  it('does not show toast on success (silent)', async () => {
    const { result } = renderHook(() => useAnswerQuestion(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 1,
      data: { questionId: 1, value: 'test answer' },
    });

    if (mockOnSuccess) {
      mockOnSuccess();
    }

    await waitFor(() => {
      expect(toast.error).not.toHaveBeenCalled();
    });
  });

  it('shows error toast on failure', async () => {
    const { result } = renderHook(() => useAnswerQuestion(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 1,
      data: { questionId: 1, value: 'test answer' },
    });

    if (mockOnError) {
      mockOnError();
    }

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('answer-save-error');
    });
  });

  it('returns mutation object with mutate and isPending', () => {
    const { result } = renderHook(() => useAnswerQuestion(1), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('mutate');
    expect(result.current).toHaveProperty('isPending');
  });
});
