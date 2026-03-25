import type { Meta, StoryObj } from '@storybook/react';

import { CountdownTimer } from './CountdownTimer.player';

const meta = {
  title: 'Features/Quiz Player/Components/CountdownTimer',
  component: CountdownTimer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onTick: () => {},
    onTimeUp: () => {},
    timeRemainingLabel: 'Time remaining',
  },
} satisfies Meta<typeof CountdownTimer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FiveMinutesRemaining: Story = {
  args: {
    remainingSeconds: 300,
  },
};

export const OneMinuteRemaining: Story = {
  args: {
    remainingSeconds: 60,
  },
};

export const TenSecondsRemaining: Story = {
  args: {
    remainingSeconds: 10,
  },
};

export const LastSecond: Story = {
  args: {
    remainingSeconds: 1,
  },
};

export const NoTimeData: Story = {
  args: {
    remainingSeconds: null,
  },
};

export const NegativeTime: Story = {
  args: {
    remainingSeconds: -1,
  },
};
