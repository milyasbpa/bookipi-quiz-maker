'use client';

import dynamic from 'next/dynamic';

import { LoadingState, StepIndicator } from '@/core/components';

import { QuizInfo } from '../sections/quiz-info';
import { useQuizCreateStore } from '../store/quiz-create.store';

// Lazy load AddQuestions section because it includes @dnd-kit drag-and-drop library
const AddQuestions = dynamic(
  () => import('../sections/add-questions').then((mod) => mod.AddQuestions),
  {
    loading: () => <LoadingState message="Loading question builder..." />,
    ssr: false,
  },
);

export function QuizCreateContainer() {
  const { currentStep } = useQuizCreateStore();

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="mx-auto max-w-6xl">
          <StepIndicator currentStep={currentStep} totalSteps={2} />
        </div>

        {currentStep === 1 && <QuizInfo />}
        {currentStep === 2 && <AddQuestions />}
      </div>
    </div>
  );
}
