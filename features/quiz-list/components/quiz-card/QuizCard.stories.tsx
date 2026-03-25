import type { Meta, StoryObj } from '@storybook/react';

import type { QuizWithQuestions } from '@/core/api/generated/quizMakerAPI.schemas';

import { QuizCard } from './QuizCard';

const meta: Meta<typeof QuizCard> = {
  title: 'Features/QuizList/Components/QuizCard',
  component: QuizCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    onNavigateToDetail: () => {},
    onNavigateToPlayer: () => {},
    translations: {
      manageQuestions: 'Manage Questions',
      startQuiz: 'Start Quiz',
      minutes: 'minutes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof QuizCard>;

export const Default: Story = {
  args: {
    quiz: {
      id: 1,
      title: 'JavaScript Basics',
      description: 'Learn fundamental JavaScript concepts',
      timeLimitSeconds: 600,
    } as QuizWithQuestions,
  },
};

export const LongTitle: Story = {
  args: {
    quiz: {
      id: 2,
      title: 'Advanced React Patterns and Best Practices for Large Scale Applications',
      description: 'Master React patterns',
      timeLimitSeconds: 1200,
    } as QuizWithQuestions,
  },
};

export const LongDescription: Story = {
  args: {
    quiz: {
      id: 3,
      title: 'TypeScript Essentials',
      description:
        'This is a comprehensive quiz covering TypeScript fundamentals, advanced types, generics, decorators, and best practices for building type-safe applications. You will learn about interfaces, type inference, union types, and much more.',
      timeLimitSeconds: 900,
    } as QuizWithQuestions,
  },
};

export const WithoutTimeLimit: Story = {
  args: {
    quiz: {
      id: 4,
      title: 'Unlimited Quiz',
      description: 'This quiz has no time limit',
      timeLimitSeconds: undefined,
    } as QuizWithQuestions,
  },
};

export const ShortTimeLimit: Story = {
  args: {
    quiz: {
      id: 5,
      title: 'Quick Test',
      description: 'A short 5-minute quiz',
      timeLimitSeconds: 300,
    } as QuizWithQuestions,
  },
};

export const LongTimeLimit: Story = {
  args: {
    quiz: {
      id: 6,
      title: 'Comprehensive Exam',
      description: 'A thorough 2-hour examination',
      timeLimitSeconds: 7200,
    } as QuizWithQuestions,
  },
};
