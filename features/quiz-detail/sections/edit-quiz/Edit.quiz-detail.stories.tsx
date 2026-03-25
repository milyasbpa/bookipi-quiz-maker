import type { Meta, StoryObj } from '@storybook/react';

import { Edit } from './Edit.quiz-detail';

const meta: Meta<typeof Edit> = {
  title: 'Features/QuizDetail/Sections/EditQuiz',
  component: Edit,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Edit>;

export const Closed: Story = {};

export const Open: Story = {};
