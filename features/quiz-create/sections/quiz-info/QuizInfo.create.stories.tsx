import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { QuizInfo } from './QuizInfo.create';

const meta: Meta<typeof QuizInfo> = {
  title: 'Features/QuizCreate/Sections/QuizInfo',
  component: QuizInfo,
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
type Story = StoryObj<typeof QuizInfo>;

export const Default: Story = {};

export const WithPrefilledData: Story = {
  parameters: {
    docs: {
      description: {
        story: 'QuizInfo section with existing quiz metadata',
      },
    },
  },
};

export const ValidationErrors: Story = {
  parameters: {
    docs: {
      description: {
        story: 'QuizInfo section showing validation errors',
      },
    },
  },
};
