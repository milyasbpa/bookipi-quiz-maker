import type { Meta, StoryObj } from '@storybook/react';

import { QuizHeader } from './QuizHeader.detail';

const meta: Meta<typeof QuizHeader> = {
  title: 'Features/QuizDetail/Sections/QuizHeader',
  component: QuizHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QuizHeader>;

export const Default: Story = {};

export const Loading: Story = {};

export const NotFound: Story = {};
