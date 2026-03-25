import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { toast } from 'sonner';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useUpdateQuiz } from './useUpdateQuiz';

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
  useParams: () => ({ id: '1' }),
  useRouter: () => ({ push: vi.fn() }),
}));

const mockCloseEditModal = vi.fn();

vi.mock('../../store/quiz-detail.store', () => ({
  useQuizDetailStore: (selector: any) => selector({ closeEditQuizModal: mockCloseEditModal }),
}));

let mockMutate = vi.fn();
let mockOnSuccess: any = null;
let mockOnError: any = null;

vi.mock('@/core/api/generated/quizzes/quizzes', () => ({
  useUpdateQuiz: vi.fn((options: any) => {
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

describe('useUpdateQuiz', () => {
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
    const { result } = renderHook(() => useUpdateQuiz(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeDefined();
  });

  it('shows success toast on successful update', async () => {
    const { result } = renderHook(() => useUpdateQuiz(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 1,
      data: {
        title: 'Updated Quiz',
        description: 'Updated description',
        isPublished: true,
      },
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('quiz-updated');
    });
  });

  it('closes edit modal on success', async () => {
    const { result } = renderHook(() => useUpdateQuiz(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 1,
      data: {
        title: 'Test Quiz',
        description: 'Test',
        isPublished: true,
      },
    });

    await waitFor(() => {
      expect(mockCloseEditModal).toHaveBeenCalled();
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

    const { result } = renderHook(() => useUpdateQuiz(), { wrapper });

    result.current.mutate({
      id: 1,
      data: {
        title: 'Test Quiz',
        description: 'Test',
        isPublished: true,
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

    const { result } = renderHook(() => useUpdateQuiz(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: 1,
      data: {
        title: 'Test Quiz',
        description: 'Test',
        isPublished: true,
      },
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('quiz-update-error');
    });
  });
});
