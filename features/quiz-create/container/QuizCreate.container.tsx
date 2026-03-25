'use client';

import { StepIndicator } from '@/core/components';

import { AddQuestions } from '../sections/add-questions';
import { QuizInfo } from '../sections/quiz-info';
import { useQuizCreateStore } from '../store/quiz-create.store';

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
