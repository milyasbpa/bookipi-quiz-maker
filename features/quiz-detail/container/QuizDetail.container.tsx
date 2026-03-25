'use client';

import { AddQuestionModal } from '../sections/add-question-modal';
import { EditQuestionModal } from '../sections/edit-question-modal';
import { Edit } from '../sections/edit-quiz';
import { QuestionList } from '../sections/question-list';
import { QuizHeader } from '../sections/quiz-header';

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
