import type { Meta, StoryObj } from '@storybook/react';

import { QuestionBreakdownPlayer } from './QuestionBreakdown.player';

const meta = {
  title: 'Features/Quiz Player/Sections/Results - Question Breakdown',
  component: QuestionBreakdownPlayer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof QuestionBreakdownPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-3xl rounded-lg border p-6">
        <p className="text-muted-foreground mb-4 text-sm">
          Note: This section requires full app context with Zustand store and React Query. See tests
          for complete behavior coverage including correct/incorrect indicators and answer display.
        </p>
        <Story />
      </div>
    ),
  ],
};
