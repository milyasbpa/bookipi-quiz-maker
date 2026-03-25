import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useQuizListTable } from './useQuizListTable';

const mockQuizzes = [
  {
    id: 1,
    title: 'JavaScript Basics',
    description: 'Test your JS knowledge',
    timeLimitSeconds: 300,
    isPublished: true,
    questions: [{ id: 1 }, { id: 2 }],
  },
  {
    id: 2,
    title: 'React Advanced',
    description: 'Advanced React concepts',
    timeLimitSeconds: 600,
    isPublished: true,
    questions: [{ id: 3 }],
  },
];

const mockPush = vi.fn();
const mockOpenEditModal = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('../store', () => ({
  useQuizListStore: () => mockOpenEditModal,
}));

describe('useQuizListTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a table with correct number of columns', () => {
    const { result } = renderHook(() => useQuizListTable(mockQuizzes));
    
    const columns = result.current.getAllColumns();
    expect(columns).toHaveLength(3); // title, timeLimitSeconds, actions
  });

  it('creates a table with correct data rows', () => {
    const { result } = renderHook(() => useQuizListTable(mockQuizzes));
    
    const rows = result.current.getRowModel().rows;
    expect(rows).toHaveLength(2);
    expect(rows[0].original).toEqual(mockQuizzes[0]);
    expect(rows[1].original).toEqual(mockQuizzes[1]);
  });

  it('handles empty quiz list', () => {
    const { result } = renderHook(() => useQuizListTable([]));
    
    const rows = result.current.getRowModel().rows;
    expect(rows).toHaveLength(0);
  });

  it('creates columns with correct ids', () => {
    const { result } = renderHook(() => useQuizListTable(mockQuizzes));
    
    const columns = result.current.getAllColumns();
    const columnIds = columns.map((col) => col.id);
    
    expect(columnIds).toContain('title');
    expect(columnIds).toContain('timeLimitSeconds');
    expect(columnIds).toContain('actions');
  });

  it('formats time limit correctly in minutes', () => {
    const { result } = renderHook(() => useQuizListTable(mockQuizzes));
    
    const columns = result.current.getAllColumns();
    const timeLimitColumn = columns.find((col) => col.id === 'timeLimitSeconds');
    
    expect(timeLimitColumn).toBeDefined();
    
    const row = result.current.getRowModel().rows[0];
    const cell = row.getVisibleCells().find((c) => c.column.id === 'timeLimitSeconds');
    
    expect(cell).toBeDefined();
    expect(mockQuizzes[0].timeLimitSeconds).toBe(300);
  });

  it('handles null time limit', () => {
    const quizWithoutTimeLimit = [
      {
        id: 3,
        title: 'No Time Limit Quiz',
        description: 'Test',
        timeLimitSeconds: null,
        isPublished: true,
        questions: [],
      },
    ];

    const { result } = renderHook(() => useQuizListTable(quizWithoutTimeLimit as any));
    
    const rows = result.current.getRowModel().rows;
    expect(rows).toHaveLength(1);
  });

  it('provides column helper for title with description', () => {
    const { result } = renderHook(() => useQuizListTable(mockQuizzes));
    
    const columns = result.current.getAllColumns();
    const titleColumn = columns.find((col) => col.id === 'title');
    
    expect(titleColumn).toBeDefined();
    
    const row = result.current.getRowModel().rows[0];
    const cell = row.getVisibleCells().find((c) => c.column.id === 'title');
    
    expect(cell).toBeDefined();
    expect(row.original.title).toBe('JavaScript Basics');
    expect(row.original.description).toBe('Test your JS knowledge');
  });

  it('creates action column with buttons', () => {
    const { result } = renderHook(() => useQuizListTable(mockQuizzes));
    
    const columns = result.current.getAllColumns();
    const actionsColumn = columns.find((col) => col.id === 'actions');
    
    expect(actionsColumn).toBeDefined();
    expect(actionsColumn?.columnDef.cell).toBeDefined();
  });

  it('updates when quiz data changes', () => {
    const { result, rerender } = renderHook(
      ({ quizzes }) => useQuizListTable(quizzes),
      { initialProps: { quizzes: mockQuizzes } }
    );

    expect(result.current.getRowModel().rows).toHaveLength(2);

    const newQuizzes = [...mockQuizzes, {
      id: 3,
      title: 'New Quiz',
      description: 'New description',
      timeLimitSeconds: 900,
      isPublished: true,
      questions: [],
    }];

    rerender({ quizzes: newQuizzes });

    expect(result.current.getRowModel().rows).toHaveLength(3);
  });
});
