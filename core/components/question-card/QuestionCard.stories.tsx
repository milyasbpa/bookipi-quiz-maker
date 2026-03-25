import type { Meta, StoryObj } from '@storybook/react';

import type { Question } from '@/core/api/generated/quizMakerAPI.schemas';

import { QuestionCard } from './QuestionCard';

const meta: Meta<typeof QuestionCard> = {
  title: 'Core/Components/QuestionCard',
  component: QuestionCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onEdit: () => {},
    onDelete: () => {},
    showAllOptions: false,
    disabled: false,
    translations: {
      answerLabel: 'Answer',
      correctAnswer: 'Correct Answer',
      edit: 'Edit',
      delete: 'Delete',
    },
  },
};

export default meta;
type Story = StoryObj<typeof QuestionCard>;

export const MCQQuestionSimple: Story = {
  name: 'MCQ Question (Simple View)',
  args: {
    question: {
      id: 1,
      position: 1,
      type: 'mcq',
      prompt: 'What is React?',
      correctAnswer: 0,
      options: [
        'A JavaScript library for building UI',
        'A CSS framework',
        'A database',
        'A server',
      ],
    } as Question,
    showAllOptions: false,
  },
};

export const MCQQuestionAllOptions: Story = {
  name: 'MCQ Question (All Options)',
  args: {
    question: {
      id: 1,
      position: 1,
      type: 'mcq',
      prompt: 'What is React?',
      correctAnswer: 0,
      options: [
        'A JavaScript library for building UI',
        'A CSS framework',
        'A database',
        'A server',
      ],
    } as Question,
    showAllOptions: true,
  },
};

export const ShortAnswerSimple: Story = {
  name: 'Short Answer (Simple View)',
  args: {
    question: {
      id: 2,
      position: 2,
      type: 'short',
      prompt: 'What does JSX stand for?',
      correctAnswer: 'JavaScript XML',
    } as Question,
    showAllOptions: false,
  },
};

export const ShortAnswerHighlighted: Story = {
  name: 'Short Answer (Highlighted)',
  args: {
    question: {
      id: 2,
      position: 2,
      type: 'short',
      prompt: 'What does JSX stand for?',
      correctAnswer: 'JavaScript XML',
    } as Question,
    showAllOptions: true,
  },
};

export const WithCustomDisplayNumber: Story = {
  name: 'Custom Display Number',
  args: {
    question: {
      id: 1,
      position: 99,
      type: 'short',
      prompt: 'This question has position 99 but displays as #5',
      correctAnswer: 'Custom number example',
    } as Question,
    displayNumber: 5,
  },
};

export const LongPrompt: Story = {
  args: {
    question: {
      id: 4,
      position: 4,
      type: 'short',
      prompt:
        'This is a very long question prompt that tests how the component handles lengthy text content. It should display properly without breaking the layout of the card component on mobile devices.',
      correctAnswer: 'Short answer',
    } as Question,
  },
};

export const LongAnswer: Story = {
  args: {
    question: {
      id: 5,
      position: 5,
      type: 'short',
      prompt: 'What is TypeScript?',
      correctAnswer:
        'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. It adds optional static typing to JavaScript which can help catch errors early in development and improve code quality.',
    } as Question,
  },
};

export const Disabled: Story = {
  args: {
    question: {
      id: 6,
      position: 6,
      type: 'mcq',
      prompt: 'Disabled question card',
      correctAnswer: 0,
      options: ['Option A', 'Option B', 'Option C'],
    } as Question,
    showAllOptions: true,
    disabled: true,
  },
};

export const WithoutAnswer: Story = {
  args: {
    question: {
      id: 7,
      position: 7,
      type: 'short',
      prompt: 'What is your name?',
      correctAnswer: undefined,
    } as Question,
  },
};
