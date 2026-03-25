import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { QuizCreateContainer } from './QuizCreate.container';

const meta: Meta<typeof QuizCreateContainer> = {
  title: 'Features/QuizCreate/Container',
  component: QuizCreateContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof QuizCreateContainer>;

export const Step1QuizInfo: Story = {};

export const Step2AddQuestions: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Container showing step 2 with add questions section',
      },
    },
  },
};
