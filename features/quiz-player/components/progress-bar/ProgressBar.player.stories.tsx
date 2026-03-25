import type { Meta, StoryObj } from '@storybook/react';

import { ProgressBar } from './ProgressBar.player';

const meta = {
  title: 'Features/Quiz Player/Components/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  args: {
    progressLabel: 'Question',
    ofLabel: 'of',
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FirstQuestion: Story = {
  args: {
    current: 0,
    total: 10,
  },
};

export const MiddleProgress: Story = {
  args: {
    current: 4,
    total: 10,
  },
};

export const AlmostComplete: Story = {
  args: {
    current: 8,
    total: 10,
  },
};

export const LastQuestion: Story = {
  args: {
    current: 9,
    total: 10,
  },
};

export const SingleQuestion: Story = {
  args: {
    current: 0,
    total: 1,
  },
};

export const ManyQuestions: Story = {
  args: {
    current: 15,
    total: 50,
  },
};
