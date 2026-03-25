import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { quizListQueryKeys } from '../keys';

import { useGetQuizzes } from './useGetQuizzes';

vi.mock('@/core/api/generated/quizzes/quizzes', () => ({
  useGetQuizzes: vi.fn(() => ({
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

describe('useGetQuizzes', () => {
  it('uses correct queryKey from centralized keys', () => {
    const { result } = renderHook(() => useGetQuizzes(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });

  it('returns quiz data when available', async () => {
    const mockQuizzes = [
      { id: 1, title: 'Quiz 1' },
      { id: 2, title: 'Quiz 2' },
    ];

    const useGetQuizzesGenerated = await import('@/core/api/generated/quizzes/quizzes');
    vi.mocked(useGetQuizzesGenerated.useGetQuizzes).mockReturnValue({
      data: mockQuizzes,
      isLoading: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useGetQuizzes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockQuizzes);
    });
  });

  it('handles loading state', async () => {
    const useGetQuizzesGenerated = await import('@/core/api/generated/quizzes/quizzes');
    vi.mocked(useGetQuizzesGenerated.useGetQuizzes).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    const { result } = renderHook(() => useGetQuizzes(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('handles error state', async () => {
    const mockError = new Error('Failed to fetch quizzes');

    const useGetQuizzesGenerated = await import('@/core/api/generated/quizzes/quizzes');
    vi.mocked(useGetQuizzesGenerated.useGetQuizzes).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
    } as any);

    const { result } = renderHook(() => useGetQuizzes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).toBe(mockError);
    });
  });
});
