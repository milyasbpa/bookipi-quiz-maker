import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

const mockQuizzes = [
  {
    id: 1,
    title: 'JavaScript Basics',
    description: 'Test your JS knowledge',
    createdAt: '2024-01-15T10:00:00Z',
    timeLimitSeconds: 300,
    isPublished: true,
    questions: [{ id: 1 }, { id: 2 }],
  },
  {
    id: 2,
    title: 'React Advanced',
    description: 'Advanced React concepts',
    createdAt: '2024-01-20T14:30:00Z',
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

vi.mock('../../react-query/hooks', () => ({
  useGetQuizzes: vi.fn(),
}));

vi.mock('../../react-table', () => ({
  useQuizListTable: vi.fn(),
}));

import { useGetQuizzes } from '../../react-query/hooks';
import { useQuizListTable } from '../../react-table';

import { List } from './List';

describe('List', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state when fetching quizzes', () => {
    vi.mocked(useGetQuizzes).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    render(<List />);
    expect(screen.getByText('loading-quizzes')).toBeInTheDocument();
  });

  it('shows empty state when no quizzes exist', () => {
    vi.mocked(useGetQuizzes).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    vi.mocked(useQuizListTable).mockReturnValue({
      getHeaderGroups: () => [],
      getRowModel: () => ({ rows: [] }),
    } as any);

    render(<List />);
    expect(screen.getByText('no-quizzes-yet')).toBeInTheDocument();
    expect(screen.getByText('no-quizzes-description')).toBeInTheDocument();
  });

  it('renders create quiz button', () => {
    vi.mocked(useGetQuizzes).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    vi.mocked(useQuizListTable).mockReturnValue({
      getHeaderGroups: () => [],
      getRowModel: () => ({ rows: [] }),
    } as any);

    render(<List />);
    const createButton = screen.getAllByText('create-quiz')[0];
    expect(createButton).toBeInTheDocument();
  });

  it('navigates to create page when create button is clicked', async () => {
    vi.mocked(useGetQuizzes).mockReturnValue({
      data: [],
      isLoading: false,
    } as any);

    vi.mocked(useQuizListTable).mockReturnValue({
      getHeaderGroups: () => [],
      getRowModel: () => ({ rows: [] }),
    } as any);

    render(<List />);
    const createButton = screen.getAllByText('create-quiz')[0];
    await userEvent.click(createButton);
    expect(mockPush).toHaveBeenCalledWith('/quiz/create');
  });

  it('renders quiz table when quizzes exist', () => {
    vi.mocked(useGetQuizzes).mockReturnValue({
      data: mockQuizzes,
      isLoading: false,
    } as any);

    vi.mocked(useQuizListTable).mockReturnValue({
      getHeaderGroups: () => [
        {
          id: 'header-group-1',
          headers: [
            {
              id: 'title',
              isPlaceholder: false,
              column: { columnDef: { header: 'Title' } },
              getContext: () => ({}),
            },
          ],
        },
      ],
      getRowModel: () => ({
        rows: [
          {
            id: '1',
            original: mockQuizzes[0],
            getVisibleCells: () => [
              {
                id: 'cell-1',
                column: { columnDef: { cell: () => 'JavaScript Basics' } },
                getContext: () => ({}),
              },
            ],
          },
        ],
      }),
    } as any);

    render(<List />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('filters out quizzes without id', () => {
    const quizzesWithUndefinedId = [
      { id: 1, title: 'Quiz 1' },
      { id: undefined, title: 'Invalid Quiz' },
      { id: 2, title: 'Quiz 2' },
    ];

    vi.mocked(useGetQuizzes).mockReturnValue({
      data: quizzesWithUndefinedId,
      isLoading: false,
    } as any);

    const mockTable = vi.fn().mockReturnValue({
      getHeaderGroups: () => [],
      getRowModel: () => ({ rows: [] }),
    });
    vi.mocked(useQuizListTable).mockImplementation(mockTable);

    render(<List />);

    expect(mockTable).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 1 }),
        expect.objectContaining({ id: 2 }),
      ]),
    );
  });
});
