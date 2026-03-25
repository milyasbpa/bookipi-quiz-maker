'use client';

import dynamic from 'next/dynamic';

import { LoadingState } from '@/core/components';

import { AddQuestionModal } from '../sections/add-question-modal';
import { EditQuestionModal } from '../sections/edit-question-modal';
import { Edit } from '../sections/edit-quiz';
import { QuizHeader } from '../sections/quiz-header';

// Lazy load QuestionList section because it includes @dnd-kit drag-and-drop library
const QuestionList = dynamic(
  () => import('../sections/question-list').then((mod) => mod.QuestionList),
  {
    loading: () => <LoadingState message="Loading questions..." />,
    ssr: false,
  },
);

export function QuizDetailContainer() {
  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      <QuizHeader />
      <QuestionList />

      <AddQuestionModal />
      <EditQuestionModal />
      <Edit />
    </div>
  );
}
