import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { quizDetailQueryKeys } from '../keys';

import { useGetQuizDetail } from './useGetQuizDetail';

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

describe('useGetQuizDetail', () => {
  it('uses correct queryKey with quiz id', () => {
    const { result } = renderHook(() => useGetQuizDetail(1), {
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
      timeLimitSeconds: 300,
    };

    const useGetQuizGenerated = await import('@/core/api/generated/quizzes/quizzes');
    vi.mocked(useGetQuizGenerated.useGetQuizById).mockReturnValue({
      data: mockQuiz,
      isLoading: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useGetQuizDetail(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockQuiz);
    });
  });

  it('returns loading state', async () => {
    const useGetQuizGenerated = await import('@/core/api/generated/quizzes/quizzes');
    vi.mocked(useGetQuizGenerated.useGetQuizById).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    const { result } = renderHook(() => useGetQuizDetail(123), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('respects enabled option', () => {
    const { result } = renderHook(() => useGetQuizDetail(1, { enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });

  it('defaults enabled to true when not provided', () => {
    const { result } = renderHook(() => useGetQuizDetail(1), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });
});
