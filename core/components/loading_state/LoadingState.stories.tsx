import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { LoadingState } from './LoadingState';

const meta: Meta<typeof LoadingState> = {
  title: 'Components/LoadingState',
  component: LoadingState,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-200 border rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LoadingState>;

export const Default: Story = {
  args: {},
};

export const WithMessage: Story = {
  args: {
    message: 'Loading quizzes...',
  },
};

export const SmallSpinner: Story = {
  args: {
    size: 40,
    message: 'Loading...',
  },
};

export const LargeSpinner: Story = {
  args: {
    size: 80,
    message: 'Processing data...',
  },
};

export const CustomColor: Story = {
  args: {
    color: '#10b981',
    message: 'Loading content...',
  },
};

export const CompactHeight: Story = {
  args: {
    minHeight: 'min-h-50',
    message: 'Loading...',
  },
};

export const TallHeight: Story = {
  args: {
    minHeight: 'min-h-150',
    message: 'Loading large dataset...',
  },
};
