import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { QuestionForm } from './QuestionForm.create';

const defaultProps = {
  onAdd: () => {},
  addQuestionTitle: 'Add Question',
  questionTypeLabel: 'Question Type',
  multipleChoiceLabel: 'Multiple Choice',
  shortAnswerLabel: 'Short Answer',
  questionPromptLabel: 'Question Prompt',
  enterQuestionPlaceholder: 'Enter your question...',
  optionsLabel: 'Options',
  correctAnswerLabel: 'Correct Answer',
  correctAnswerPlaceholder: 'Enter correct answer...',
  addOptionButton: 'Add Option',
  optionPlaceholder: 'Option',
  selectCorrectHint: 'Select the correct option',
  addQuestionButton: 'Add Question',
};

const meta: Meta<typeof QuestionForm> = {
  title: 'Features/QuizCreate/Components/QuestionForm',
  component: QuestionForm,
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
  args: defaultProps,
};

export default meta;
type Story = StoryObj<typeof QuestionForm>;

export const MultipleChoice: Story = {};

export const ShortAnswer: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Question form in short answer mode',
      },
    },
  },
};

export const WithValidation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Question form showing validation errors',
      },
    },
  },
};
