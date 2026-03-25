import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { QuizListContainer } from './QuizList.container';

const meta: Meta<typeof QuizListContainer> = {
  title: 'Features/QuizList/Container',
  component: QuizListContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof QuizListContainer>;

export const Default: Story = {};

export const EmptyState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Container when there are no quizzes',
      },
    },
  },
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Container while quizzes are being fetched',
      },
    },
  },
};
