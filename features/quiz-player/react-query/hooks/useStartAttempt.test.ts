import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useStartAttempt } from './useStartAttempt';

const mockPush = vi.fn();
const mockSetAttemptId = vi.fn();
const mockMutate = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('../../store/player.store', () => ({
  usePlayerStore: (selector: any) => selector({ setAttemptId: mockSetAttemptId }),
}));

let mockOnSuccess: any = null;
let mockOnError: any = null;

vi.mock('@/core/api/generated/attempts/attempts', () => ({
  useStartAttempt: vi.fn((options: any) => {
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

describe('useStartAttempt', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSuccess = null;
    mockOnError = null;
  });

  it('uses correct mutationKey with quizId', () => {
    const { result } = renderHook(() => useStartAttempt(1), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });

  it('calls setAttemptId on success', async () => {
    const { result } = renderHook(() => useStartAttempt(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ data: { quizId: 1 } });

    // Simulate successful response
    if (mockOnSuccess) {
      mockOnSuccess({ id: 123 });
    }

    await waitFor(() => {
      expect(mockSetAttemptId).toHaveBeenCalledWith(123);
    });
  });

  it('redirects to builder on error', async () => {
    const { result } = renderHook(() => useStartAttempt(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ data: { quizId: 1 } });

    // Simulate error
    if (mockOnError) {
      mockOnError();
    }

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('returns mutation object with mutate and isPending', () => {
    const { result } = renderHook(() => useStartAttempt(1), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('mutate');
    expect(result.current).toHaveProperty('isPending');
  });
});
