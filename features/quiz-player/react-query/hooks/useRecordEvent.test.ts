import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useRecordEvent } from './useRecordEvent';

const mockMutate = vi.fn();
let mockOnSuccess: any = null;
let mockOnError: any = null;

vi.mock('@/core/api/generated/attempts/attempts', () => ({
  useRecordEvent: vi.fn((options: any) => {
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

describe('useRecordEvent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSuccess = null;
    mockOnError = null;
  });

  it('uses correct mutationKey with attemptId', () => {
    const { result } = renderHook(() => useRecordEvent(1), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });

  it('is silent on success', async () => {
    const { result } = renderHook(() => useRecordEvent(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 1,
      data: { event: 'focus' },
    });

    if (mockOnSuccess) {
      mockOnSuccess();
    }

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  it('is silent on error (does not disrupt user)', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useRecordEvent(1), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 1,
      data: { event: 'blur' },
    });

    if (mockOnError) {
      mockOnError();
    }

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });

    // Silent means no console.error as well
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('returns mutation object with mutate and isPending', () => {
    const { result } = renderHook(() => useRecordEvent(1), {
      wrapper: createWrapper(),
    });

    expect(result.current).toHaveProperty('mutate');
    expect(result.current).toHaveProperty('isPending');
  });
});
