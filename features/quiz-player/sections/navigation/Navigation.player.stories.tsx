import type { Meta, StoryObj } from '@storybook/react';

import { NavigationPlayer } from './Navigation.player';

const meta = {
  title: 'Features/Quiz Player/Sections/Navigation',
  component: NavigationPlayer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-2xl rounded-lg border p-6">
        <p className="text-muted-foreground mb-4 text-sm">
          Note: This section requires full app context with Zustand store and React Query. See tests
          for complete behavior coverage.
        </p>
        <Story />
      </div>
    ),
  ],
};
