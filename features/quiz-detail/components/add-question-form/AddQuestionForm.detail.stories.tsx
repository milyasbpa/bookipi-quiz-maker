import type { Meta, StoryObj } from '@storybook/react';

import { AddQuestionForm } from './AddQuestionForm.detail';

const meta: Meta<typeof AddQuestionForm> = {
  title: 'Features/QuizDetail/Components/AddQuestionForm',
  component: AddQuestionForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    questionTypeLabel: 'Question Type',
    questionTypeMcq: 'Multiple Choice',
    questionTypeShort: 'Short Answer',
    questionPromptLabel: 'Question',
    promptPlaceholder: 'Enter your question...',
    correctAnswerLabel: 'Correct Answer',
    answerPlaceholder: 'Enter correct answer...',
    addOptionButton: 'Add Option',
    optionPlaceholder: 'Option',
    selectCorrectHint: 'Select the correct answer',
    addButtonLabel: 'Add Question',
    addingLabel: 'Adding...',
    onSubmit: () => {},
    isPending: false,
  },
};

export default meta;
type Story = StoryObj<typeof AddQuestionForm>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isPending: true,
  },
};
