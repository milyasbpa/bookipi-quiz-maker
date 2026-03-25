import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Edit } from './Edit.quiz-list';

const meta: Meta<typeof Edit> = {
  title: 'Features/QuizList/Sections/Edit',
  component: Edit,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Edit>;

export const Open: Story = {
  parameters: {
    mockData: {
      isOpen: true,
      editQuizId: 1,
      editQuizData: {
        title: 'JavaScript Basics',
        description: 'Test your JavaScript knowledge',
        timeLimitSeconds: 300,
      },
    },
  },
};

export const WithLongContent: Story = {
  parameters: {
    mockData: {
      isOpen: true,
      editQuizId: 2,
      editQuizData: {
        title: 'Advanced React Patterns and Best Practices for Modern Applications',
        description:
          'This comprehensive quiz covers advanced React concepts including hooks, context, performance optimization, concurrent rendering, server components, and modern state management patterns. You will be tested on your understanding of React internals and best practices for building scalable applications.',
        timeLimitSeconds: 1800,
      },
    },
  },
};

export const WithMinimalContent: Story = {
  parameters: {
    mockData: {
      isOpen: true,
      editQuizId: 3,
      editQuizData: {
        title: 'Quick Quiz',
        description: 'Short test',
        timeLimitSeconds: 60,
      },
    },
  },
};

export const Closed: Story = {
  parameters: {
    mockData: {
      isOpen: false,
      editQuizId: null,
      editQuizData: null,
    },
  },
};

export const Saving: Story = {
  parameters: {
    mockData: {
      isOpen: true,
      editQuizId: 4,
      editQuizData: {
        title: 'TypeScript Quiz',
        description: 'Test your TypeScript skills',
        timeLimitSeconds: 600,
      },
      isPending: true,
    },
  },
};
