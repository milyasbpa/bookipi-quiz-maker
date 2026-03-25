import type { Meta, StoryObj } from '@storybook/react';

import { QuizHeaderPlayer } from './QuizHeader.player';

const meta = {
  title: 'Features/Quiz Player/Sections/Quiz Header',
  component: QuizHeaderPlayer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof QuizHeaderPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-3xl rounded-lg border p-6">
        <p className="text-muted-foreground mb-4 text-sm">
          Note: This section requires full app context with Zustand store and React Query. See tests
          for complete behavior coverage including quiz loading, progress tracking, and countdown
          timer.
        </p>
        <Story />
      </div>
    ),
  ],
};
