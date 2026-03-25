import { getCoreRowModel, useReactTable, createColumnHelper } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import type { QuizWithQuestions } from '@/core/api/generated/quizMakerAPI.schemas';

import { QuizTable } from './QuizTable';

const columnHelper = createColumnHelper<QuizWithQuestions>();

const mockColumns = [
  columnHelper.accessor('title', {
    header: 'Quiz Title',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('timeLimitSeconds', {
    header: 'Time Limit',
    cell: (info) => (info.getValue() ? `${Math.floor(info.getValue()! / 60)} min` : '-'),
  }),
];

describe('QuizTable', () => {
  it('renders table with quiz data', () => {
    const mockData: QuizWithQuestions[] = [
      {
        id: 1,
        title: 'JavaScript Basics',
        description: 'Learn JS fundamentals',
        timeLimitSeconds: 600,
      },
      {
        id: 2,
        title: 'React Advanced',
        description: 'Master React concepts',
        timeLimitSeconds: 1200,
      },
    ];

    const TestComponent = () => {
      const table = useReactTable({
        data: mockData,
        columns: mockColumns,
        getCoreRowModel: getCoreRowModel(),
      });

      return <QuizTable table={table} />;
    };

    render(<TestComponent />);

    expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
    expect(screen.getByText('React Advanced')).toBeInTheDocument();
    expect(screen.getByText('Quiz Title')).toBeInTheDocument();
    expect(screen.getByText('Time Limit')).toBeInTheDocument();
  });

  it('renders empty table when no data', () => {
    const TestComponent = () => {
      const table = useReactTable({
        data: [],
        columns: mockColumns,
        getCoreRowModel: getCoreRowModel(),
      });

      return <QuizTable table={table} />;
    };

    render(<TestComponent />);

    expect(screen.getByText('Quiz Title')).toBeInTheDocument();
    expect(screen.getByText('Time Limit')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const TestComponent = () => {
      const table = useReactTable({
        data: [],
        columns: mockColumns,
        getCoreRowModel: getCoreRowModel(),
      });

      return <QuizTable table={table} />;
    };

    const { container } = render(<TestComponent />);
    const tableWrapper = container.querySelector('.md\\:block');

    expect(tableWrapper).toBeInTheDocument();
    expect(tableWrapper).toHaveClass('hidden', 'rounded-lg', 'border');
  });
});
