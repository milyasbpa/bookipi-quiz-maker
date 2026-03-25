import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { StepIndicator } from './StepIndicator';

const meta: Meta<typeof StepIndicator> = {
  title: 'Components/StepIndicator',
  component: StepIndicator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof StepIndicator>;

export const TwoStepsFirst: Story = {
  args: {
    currentStep: 1,
    totalSteps: 2,
  },
};

export const TwoStepsSecond: Story = {
  args: {
    currentStep: 2,
    totalSteps: 2,
  },
};

export const ThreeStepsFirst: Story = {
  args: {
    currentStep: 1,
    totalSteps: 3,
  },
};

export const ThreeStepsSecond: Story = {
  args: {
    currentStep: 2,
    totalSteps: 3,
  },
};

export const ThreeStepsThird: Story = {
  args: {
    currentStep: 3,
    totalSteps: 3,
  },
};

export const FourSteps: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
  },
};

export const ManySteps: Story = {
  args: {
    currentStep: 3,
    totalSteps: 6,
  },
};
