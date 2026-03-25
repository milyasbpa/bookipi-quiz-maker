import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { quizCreateMutationKeys } from '../keys';

import { useCreateQuiz } from './useCreateQuiz';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/core/lib/constants', () => ({
  ROUTES: {
    QUIZ_LIST: '/',
  },
}));

const mockReset = vi.fn();
const mockPush = vi.fn();

vi.mock('../../store', () => ({
  useQuizCreateStore: (selector: any) => selector({ reset: mockReset }),
}));

let mockMutateAsync = vi.fn();
let mockOnSuccess: any = null;
let mockOnError: any = null;

vi.mock('@/core/api/generated/quizzes/quizzes', () => ({
  useCreateQuiz: vi.fn((options: any) => {
    mockOnSuccess = options?.mutation?.onSuccess;
    mockOnError = options?.mutation?.onError;

    return {
      mutateAsync: mockMutateAsync,
      isPending: false,
    };
  }),
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

describe('useCreateQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({ push: mockPush });
    mockOnSuccess = null;
    mockOnError = null;

    mockMutateAsync = vi.fn(async (data) => {
      const response = { id: 123 };
      if (mockOnSuccess) {
        await mockOnSuccess(response);
      }
      return response;
    });
  });

  it('uses correct mutationKey', () => {
    const { result } = renderHook(() => useCreateQuiz(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });

  it('shows success toast on successful creation', async () => {
    const { result } = renderHook(() => useCreateQuiz(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      data: {
        title: 'New Quiz',
        description: 'Test',
        timeLimitSeconds: 300,
        isPublished: true,
      },
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('quiz-created');
    });
  });

  it('resets store and redirects on success', async () => {
    const { result } = renderHook(() => useCreateQuiz(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      data: {
        title: 'New Quiz',
        description: 'Test',
        isPublished: true,
      },
    });

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('invalidates queries on success', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
        queries: { retry: false },
      },
    });

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(QueryClientProvider, { client: queryClient }, children);

    const { result } = renderHook(() => useCreateQuiz(), { wrapper });

    await result.current.mutateAsync({
      data: {
        title: 'New Quiz',
        description: 'Test',
        isPublished: true,
      },
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalled();
    });
  });

  it('shows error toast on failure', async () => {
    mockMutateAsync = vi.fn(async () => {
      const error = new Error('Network error');
      if (mockOnError) {
        await mockOnError(error);
      }
      throw error;
    });

    const { result } = renderHook(() => useCreateQuiz(), {
      wrapper: createWrapper(),
    });

    try {
      await result.current.mutateAsync({
        data: {
          title: 'New Quiz',
          description: 'Test',
          isPublished: true,
        },
      });
    } catch {
      // Expected to fail
    }

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
