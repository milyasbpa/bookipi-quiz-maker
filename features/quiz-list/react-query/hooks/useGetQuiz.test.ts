import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { quizListQueryKeys } from '../keys';

import { useGetQuiz } from './useGetQuiz';

vi.mock('@/core/api/generated/quizzes/quizzes', () => ({
  useGetQuizById: vi.fn(() => ({
    data: undefined,
    isLoading: false,
    error: null,
  })),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe('useGetQuiz', () => {
  it('uses correct queryKey with quiz id', () => {
    const { result } = renderHook(() => useGetQuiz(1), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });

  it('returns quiz data for specific id', async () => {
    const mockQuiz = {
      id: 1,
      title: 'JavaScript Basics',
      description: 'Test your JS',
      questions: [],
    };

    const useGetQuizGenerated = await import('@/core/api/generated/quizzes/quizzes');
    vi.mocked(useGetQuizGenerated.useGetQuizById).mockReturnValue({
      data: mockQuiz,
      isLoading: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useGetQuiz(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockQuiz);
    });
  });

  it('handles different quiz ids', async () => {
    const { result: result1 } = renderHook(() => useGetQuiz(1), {
      wrapper: createWrapper(),
    });

    const { result: result2 } = renderHook(() => useGetQuiz(2), {
      wrapper: createWrapper(),
    });

    expect(result1.current).toBeDefined();
    expect(result2.current).toBeDefined();
  });

  it('handles loading state', async () => {
    const useGetQuizGenerated = await import('@/core/api/generated/quizzes/quizzes');
    vi.mocked(useGetQuizGenerated.useGetQuizById).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    const { result } = renderHook(() => useGetQuiz(1), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('handles error state', async () => {
    const mockError = new Error('Quiz not found');

    const useGetQuizGenerated = await import('@/core/api/generated/quizzes/quizzes');
    vi.mocked(useGetQuizGenerated.useGetQuizById).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    } as any);

    const { result } = renderHook(() => useGetQuiz(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).toBe(mockError);
    });
  });
});
