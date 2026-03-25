import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { List } from './List';

const mockQuizzes = [
  {
    id: 1,
    title: 'JavaScript Basics',
    description: 'Test your JavaScript knowledge',
    createdAt: '2024-01-15T10:00:00Z',
    timeLimitSeconds: 300,
    isPublished: true,
    questions: [{ id: 1 }, { id: 2 }, { id: 3 }],
  },
  {
    id: 2,
    title: 'React Advanced',
    description: 'Advanced React patterns and hooks',
    createdAt: '2024-01-20T14:30:00Z',
    timeLimitSeconds: 600,
    isPublished: true,
    questions: [{ id: 4 }],
  },
  {
    id: 3,
    title: 'TypeScript Deep Dive',
    description: 'Master TypeScript',
    createdAt: '2024-02-01T09:15:00Z',
    timeLimitSeconds: 900,
    isPublished: false,
    questions: [],
  },
];

const meta: Meta<typeof List> = {
  title: 'Features/QuizList/Sections/List',
  component: List,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-6xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof List>;

export const WithQuizzes: Story = {
  parameters: {
    mockData: {
      quizzes: mockQuizzes,
    },
  },
};

export const Empty: Story = {
  parameters: {
    mockData: {
      quizzes: [],
    },
  },
};

export const Loading: Story = {
  parameters: {
    mockData: {
      isLoading: true,
    },
  },
};

export const SingleQuiz: Story = {
  parameters: {
    mockData: {
      quizzes: [mockQuizzes[0]],
    },
  },
};

export const ManyQuizzes: Story = {
  parameters: {
    mockData: {
      quizzes: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Quiz ${i + 1}`,
        description: `Description for quiz ${i + 1}`,
        createdAt: new Date(2024, 0, i + 1).toISOString(),
        timeLimitSeconds: 300 + i * 60,
        isPublished: i % 2 === 0,
        questions: Array.from({ length: i + 1 }, (_, j) => ({ id: j })),
      })),
    },
  },
};
