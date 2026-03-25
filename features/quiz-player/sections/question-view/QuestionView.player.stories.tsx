import type { Meta, StoryObj } from '@storybook/react';

import { QuestionViewPlayer } from './QuestionView.player';

const meta = {
  title: 'Features/Quiz Player/Sections/Question View',
  component: QuestionViewPlayer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof QuestionViewPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-3xl rounded-lg border p-6">
        <p className="text-muted-foreground mb-4 text-sm">
          Note: This section requires full app context with Zustand store and React Query. See tests
          for complete behavior coverage with MCQ, short answer, and code question types.
        </p>
        <Story />
      </div>
    ),
  ],
};
