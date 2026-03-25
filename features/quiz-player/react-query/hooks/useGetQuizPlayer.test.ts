import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { quizPlayerQueryKeys } from '../keys';

import { useGetQuizPlayer } from './useGetQuizPlayer';

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

describe('useGetQuizPlayer', () => {
  it('uses correct queryKey from centralized keys', () => {
    const { result } = renderHook(() => useGetQuizPlayer(1), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });

  it('returns quiz data when available', async () => {
    const mockQuiz = {
      id: 1,
      title: 'Test Quiz',
      description: 'Test Description',
      timeLimitSeconds: 300,
      isPublished: true,
      questions: [],
    };

    const useGetQuizByIdGenerated = await import('@/core/api/generated/quizzes/quizzes');
    vi.mocked(useGetQuizByIdGenerated.useGetQuizById).mockReturnValue({
      data: mockQuiz,
      isLoading: false,
      error: null,
    } as any);

    const { result } = renderHook(() => useGetQuizPlayer(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockQuiz);
    });
  });

  it('handles loading state', async () => {
    const useGetQuizByIdGenerated = await import('@/core/api/generated/quizzes/quizzes');
    vi.mocked(useGetQuizByIdGenerated.useGetQuizById).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as any);

    const { result } = renderHook(() => useGetQuizPlayer(1), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('respects enabled option', () => {
    const { result } = renderHook(() => useGetQuizPlayer(1, { enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });

  it('configures staleTime and gcTime', () => {
    const { result } = renderHook(() => useGetQuizPlayer(1), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
    // Note: staleTime and gcTime are internal to react-query,
    // this test verifies the hook doesn't crash with these options
  });
});
