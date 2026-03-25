'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Dialog } from '@/core/components';

import { AddQuestionForm } from '../../components/add-question-form';
import { useCreateQuestion } from '../../react-query';
import type { QuestionFormValues } from '../../schemas/add-question-form.schema';
import { useQuizDetailStore } from '../../store/quiz-detail.store';

export function AddQuestionModal() {
  const params = useParams();
  const t = useTranslations('quiz-maker.builder');
  const quizId = Number(params.id);

  const isOpen = useQuizDetailStore((s) => s.isAddQuestionModalOpen);
  const closeModal = useQuizDetailStore((s) => s.closeAddQuestionModal);

  const { mutate, isPending } = useCreateQuestion(quizId);

  const handleSubmit = (values: QuestionFormValues, reset: () => void) => {
    mutate(
      { id: quizId, data: values },
      {
        onSuccess: () => {
          reset();
          closeModal();
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeModal}
      title={t('add-question-modal-title')}
      description={t('add-question-modal-description')}
      size="lg"
    >
      <AddQuestionForm
        onSubmit={handleSubmit}
        isPending={isPending}
        questionTypeLabel={t('question-type')}
        questionTypeMcq={t('question-type-mcq')}
        questionTypeShort={t('question-type-short')}
        questionPromptLabel={t('question-prompt')}
        promptPlaceholder={t('prompt-placeholder')}
        correctAnswerLabel={t('correct-answer')}
        answerPlaceholder={t('answer-placeholder')}
        addOptionButton={t('add-option-button')}
        optionPlaceholder={t('add-option-placeholder')}
        selectCorrectHint={t('select-correct-hint')}
        addButtonLabel={t('add-question')}
        addingLabel={t('adding')}
      />
    </Dialog>
  );
}
