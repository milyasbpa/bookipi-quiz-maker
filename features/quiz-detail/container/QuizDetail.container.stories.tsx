import type { Meta, StoryObj } from '@storybook/react';

import { QuizDetailContainer } from './QuizDetail.container';

const meta: Meta<typeof QuizDetailContainer> = {
  title: 'Features/QuizDetail/Container/QuizDetailContainer',
  component: QuizDetailContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QuizDetailContainer>;

export const Default: Story = {};
