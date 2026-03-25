import type { Meta, StoryObj } from '@storybook/react';

import { EditQuestionModal } from './EditQuestionModal.detail';

const meta: Meta<typeof EditQuestionModal> = {
  title: 'Features/QuizDetail/Sections/EditQuestionModal',
  component: EditQuestionModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EditQuestionModal>;

export const Closed: Story = {};

export const Open: Story = {};
