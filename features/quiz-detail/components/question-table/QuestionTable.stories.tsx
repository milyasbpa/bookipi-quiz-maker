import type { Meta, StoryObj } from '@storybook/react';
import { getCoreRowModel, useReactTable, createColumnHelper } from '@tanstack/react-table';

import type { Question } from '@/core/api/generated/quizMakerAPI.schemas';

import { QuestionTable } from './QuestionTable';

const columnHelper = createColumnHelper<Question>();

const mockColumns = [
  columnHelper.accessor('position', {
    header: '#',
    cell: (info) => (
      <span className="text-muted-foreground font-mono text-sm">{info.getValue()}</span>
    ),
    size: 60,
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => (
      <span className="bg-muted rounded-full px-2 py-1 text-xs font-medium uppercase">
        {info.getValue()}
      </span>
    ),
    size: 100,
  }),
  columnHelper.accessor('prompt', {
    header: 'Question',
    cell: (info) => <div className="max-w-md truncate">{info.getValue()}</div>,
  }),
  columnHelper.display({
    id: 'answer',
    header: 'Answer',
    cell: ({ row }) => {
      const question = row.original;
      if (question.type === 'mcq' && question.options) {
        const index = question.correctAnswer as number;
        return <div className="max-w-xs truncate text-sm">{question.options[index] || '-'}</div>;
      }
      return <div className="max-w-xs truncate text-sm">{question.correctAnswer || '-'}</div>;
    },
    size: 200,
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: () => <div className="text-muted-foreground text-sm">Actions...</div>,
    size: 140,
  }),
];

const QuestionTableWrapper = ({ data }: { data: Question[] }) => {
  const table = useReactTable({
    data,
    columns: mockColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <QuestionTable table={table} />;
};

const meta: Meta<typeof QuestionTableWrapper> = {
  title: 'Features/QuizDetail/Components/QuestionTable',
  component: QuestionTableWrapper,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QuestionTableWrapper>;

export const Default: Story = {
  args: {
    data: [
      {
        id: 1,
        position: 1,
        type: 'mcq',
        prompt: 'What is React?',
        correctAnswer: 0,
        options: ['A library', 'A framework', 'An IDE', 'A database'],
      },
      {
        id: 2,
        position: 2,
        type: 'short',
        prompt: 'What does JSX stand for?',
        correctAnswer: 'JavaScript XML',
      },
    ],
  },
};

export const MCQOnly: Story = {
  args: {
    data: [
      {
        id: 1,
        position: 1,
        type: 'mcq',
        prompt: 'What is the correct syntax for a React component?',
        correctAnswer: 1,
        options: [
          'class Component',
          'function Component()',
          'const Component = () => {}',
          'def Component',
        ],
      },
      {
        id: 2,
        position: 2,
        type: 'mcq',
        prompt: 'Which hook is used for side effects?',
        correctAnswer: 2,
        options: ['useState', 'useContext', 'useEffect', 'useReducer'],
      },
    ],
  },
};

export const ShortAnswerOnly: Story = {
  args: {
    data: [
      {
        id: 1,
        position: 1,
        type: 'short',
        prompt: 'What is the output of 2 + 2?',
        correctAnswer: '4',
      },
      {
        id: 2,
        position: 2,
        type: 'short',
        prompt: 'What does HTML stand for?',
        correctAnswer: 'HyperText Markup Language',
      },
    ],
  },
};

export const WithLongText: Story = {
  args: {
    data: [
      {
        id: 1,
        position: 1,
        type: 'short',
        prompt:
          'This is a very long question prompt that tests how the component handles lengthy text content. It should be properly truncated or wrapped to maintain a clean layout in the table view.',
        correctAnswer:
          'This is also a very long answer that should be truncated in the table to prevent layout issues.',
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
};
