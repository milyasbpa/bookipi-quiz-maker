import type { Meta, StoryObj } from '@storybook/react';

import { ScoreCardPlayer } from './ScoreCard.player';

const meta = {
  title: 'Features/Quiz Player/Sections/Results - Score Card',
  component: ScoreCardPlayer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScoreCardPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-2xl rounded-lg border p-6">
        <p className="text-muted-foreground mb-4 text-sm">
          Note: This section requires full app context with Zustand store and React Query. See tests
          for complete behavior coverage including perfect score, good score, and needs improvement
          states.
        </p>
        <Story />
      </div>
    ),
  ],
};
