import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AddQuestions } from './AddQuestions.create';

const mockQuestions = [
  {
    type: 'mcq' as const,
    prompt: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 'Paris',
  },
  {
    type: 'short' as const,
    prompt: 'What is 2 + 2?',
    correctAnswer: '4',
  },
];

const meta: Meta<typeof AddQuestions> = {
  title: 'Features/QuizCreate/Sections/AddQuestions',
  component: AddQuestions,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-6xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AddQuestions>;

export const Empty: Story = {};

export const WithQuestions: Story = {
  parameters: {
    mockData: {
      questions: mockQuestions,
    },
    docs: {
      description: {
        story: 'AddQuestions section with several questions already added',
      },
    },
  },
};

export const SingleQuestion: Story = {
  parameters: {
    mockData: {
      questions: [mockQuestions[0]],
    },
    docs: {
      description: {
        story: 'AddQuestions section with one question',
      },
    },
  },
};

export const ManyQuestions: Story = {
  parameters: {
    mockData: {
      questions: Array.from({ length: 10 }, (_, i) => ({
        type: 'mcq' as const,
        prompt: `Question ${i + 1}?`,
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 'A',
      })),
    },
    docs: {
      description: {
        story: 'AddQuestions section with many questions',
      },
    },
  },
};
