import type { Meta, StoryObj } from '@storybook/react';

import { AntiCheatSummaryPlayer } from './AntiCheatSummary.player';

const meta = {
  title: 'Features/Quiz Player/Sections/Results - Anti-Cheat Summary',
  component: AntiCheatSummaryPlayer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AntiCheatSummaryPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NoEvents: Story = {
  args: {
    events: [],
  },
};

export const WithEvents: Story = {
  args: {
    events: [
      { type: 'blur', timestamp: '2024-01-01T10:00:00Z' },
      { type: 'focus', timestamp: '2024-01-01T10:00:30Z' },
      { type: 'blur', timestamp: '2024-01-01T10:01:00Z' },
      { type: 'focus', timestamp: '2024-01-01T10:01:15Z' },
      { type: 'paste', timestamp: '2024-01-01T10:02:00Z' },
      { type: 'paste', timestamp: '2024-01-01T10:03:00Z' },
      { type: 'blur', timestamp: '2024-01-01T10:04:00Z' },
    ],
  },
};

export const OnlyBlurEvents: Story = {
  args: {
    events: [
      { type: 'blur', timestamp: '2024-01-01T10:00:00Z' },
      { type: 'focus', timestamp: '2024-01-01T10:00:30Z' },
      { type: 'blur', timestamp: '2024-01-01T10:01:00Z' },
      { type: 'focus', timestamp: '2024-01-01T10:01:30Z' },
    ],
  },
};

export const OnlyPasteEvents: Story = {
  args: {
    events: [
      { type: 'paste', timestamp: '2024-01-01T10:00:00Z' },
      { type: 'paste', timestamp: '2024-01-01T10:01:00Z' },
      { type: 'paste', timestamp: '2024-01-01T10:02:00Z' },
    ],
  },
};

export const InContainer: Story = {
  args: {
    events: [
      { type: 'blur', timestamp: '2024-01-01T10:00:00Z' },
      { type: 'paste', timestamp: '2024-01-01T10:02:00Z' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
};
