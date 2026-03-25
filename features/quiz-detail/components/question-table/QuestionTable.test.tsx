import { getCoreRowModel, useReactTable, createColumnHelper } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import type { Question } from '@/core/api/generated/quizMakerAPI.schemas';

import { QuestionTable } from './QuestionTable';

const columnHelper = createColumnHelper<Question>();

const mockColumns = [
  columnHelper.accessor('position', {
    header: '#',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('prompt', {
    header: 'Question',
    cell: (info) => info.getValue(),
  }),
];

describe('QuestionTable', () => {
  it('renders table with question data', () => {
    const mockData: Question[] = [
      {
        id: 1,
        position: 1,
        type: 'mcq',
        prompt: 'What is React?',
        correctAnswer: 0,
        options: ['A library', 'A framework'],
      },
      {
        id: 2,
        position: 2,
        type: 'short',
        prompt: 'What is TypeScript?',
        correctAnswer: 'A typed superset of JavaScript',
      },
    ];

    const TestComponent = () => {
      const table = useReactTable({
        data: mockData,
        columns: mockColumns,
        getCoreRowModel: getCoreRowModel(),
      });

      return <QuestionTable table={table} />;
    };

    render(<TestComponent />);

    expect(screen.getByText('What is React?')).toBeInTheDocument();
    expect(screen.getByText('What is TypeScript?')).toBeInTheDocument();
    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('renders empty table when no data', () => {
    const TestComponent = () => {
      const table = useReactTable({
        data: [],
        columns: mockColumns,
        getCoreRowModel: getCoreRowModel(),
      });

      return <QuestionTable table={table} />;
    };

    render(<TestComponent />);

    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const TestComponent = () => {
      const table = useReactTable({
        data: [],
        columns: mockColumns,
        getCoreRowModel: getCoreRowModel(),
      });

      return <QuestionTable table={table} />;
    };

    const { container } = render(<TestComponent />);
    const tableWrapper = container.querySelector('.md\\:block');

    expect(tableWrapper).toBeInTheDocument();
    expect(tableWrapper).toHaveClass('hidden', 'rounded-lg', 'border');
  });
});
