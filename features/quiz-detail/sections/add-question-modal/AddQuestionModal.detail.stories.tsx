import type { Meta, StoryObj } from '@storybook/react';

import { AddQuestionModal } from './AddQuestionModal.detail';

const meta: Meta<typeof AddQuestionModal> = {
  title: 'Features/QuizDetail/Sections/AddQuestionModal',
  component: AddQuestionModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AddQuestionModal>;

export const Closed: Story = {};

export const Open: Story = {};
