import type { Meta, StoryObj } from '@storybook/react';

import { QuestionList } from './QuestionList.detail';

const meta: Meta<typeof QuestionList> = {
  title: 'Features/QuizDetail/Sections/QuestionList',
  component: QuestionList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QuestionList>;

export const Default: Story = {};

export const Loading: Story = {};

export const Empty: Story = {};

export const WithQuestions: Story = {};
