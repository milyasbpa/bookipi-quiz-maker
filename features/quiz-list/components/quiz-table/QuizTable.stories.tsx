import type { Meta, StoryObj } from '@storybook/react';
import { getCoreRowModel, useReactTable, createColumnHelper } from '@tanstack/react-table';

import type { QuizWithQuestions } from '@/core/api/generated/quizMakerAPI.schemas';

import { QuizTable } from './QuizTable';

const columnHelper = createColumnHelper<QuizWithQuestions>();

const mockColumns = [
  columnHelper.accessor('title', {
    header: 'Quiz Title',
    cell: (info) => (
      <div className="min-w-50">
        <div className="font-semibold">{info.getValue()}</div>
        <div className="text-muted-foreground mt-1 line-clamp-2 text-sm">
          {info.row.original.description}
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('timeLimitSeconds', {
    header: 'Time Limit',
    cell: (info) => {
      const seconds = info.getValue();
      if (!seconds) return <span className="text-muted-foreground text-sm">-</span>;
      return <span className="text-sm">{Math.floor(seconds / 60)} min</span>;
    },
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: () => <div className="text-muted-foreground text-sm">Actions...</div>,
  }),
];

const QuizTableWrapper = ({ data }: { data: QuizWithQuestions[] }) => {
  const table = useReactTable({
    data,
    columns: mockColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <QuizTable table={table} />;
};

const meta: Meta<typeof QuizTableWrapper> = {
  title: 'Features/QuizList/Components/QuizTable',
  component: QuizTableWrapper,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QuizTableWrapper>;

export const Default: Story = {
  args: {
    data: [
      {
        id: 1,
        title: 'JavaScript Basics',
        description: 'Learn fundamental JavaScript concepts',
        timeLimitSeconds: 600,
      },
      {
        id: 2,
        title: 'React Advanced',
        description: 'Master advanced React patterns and hooks',
        timeLimitSeconds: 1200,
      },
      {
        id: 3,
        title: 'TypeScript Essentials',
        description: 'Type-safe JavaScript development',
        timeLimitSeconds: 900,
      },
    ],
  },
};

export const WithManyQuizzes: Story = {
  args: {
    data: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Quiz ${i + 1}`,
      description: `Description for quiz ${i + 1}`,
      timeLimitSeconds: (i + 1) * 300,
    })),
  },
};

export const WithoutTimeLimit: Story = {
  args: {
    data: [
      {
        id: 1,
        title: 'Unlimited Quiz',
        description: 'This quiz has no time limit',
        timeLimitSeconds: undefined,
      },
    ],
  },
};

export const WithLongText: Story = {
  args: {
    data: [
      {
        id: 1,
        title: 'A Very Long Quiz Title That Should Be Handled Properly',
        description:
          'This is a very long description that tests how the component handles lengthy text content. It should be properly truncated or wrapped to maintain a clean layout.',
        timeLimitSeconds: 1800,
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
};
