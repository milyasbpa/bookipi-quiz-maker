'use client';

import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useCreateQuestion as useCreateQuestionGenerated } from '@/core/api/generated/questions/questions';
import { Button } from '@/core/components';
import { ROUTES } from '@/core/lib/routes';

import { QuestionEditModal } from '../../components/question-edit-modal';
import { QuestionForm } from '../../components/question-form';
import { SortableQuestionCard } from '../../components/sortable-question-card';
import { useCreateQuiz } from '../../react-query';
import { useQuizCreateStore, type Question } from '../../store/quiz-create.store';

export function AddQuestions() {
  const t = useTranslations('quiz-maker.builder');
  const router = useRouter();
  const {
    quizMetadata,
    questions,
    prevStep,
    addQuestion,
    updateQuestion,
    removeQuestion,
    reorderQuestions,
    reset,
  } = useQuizCreateStore();
  const createQuiz = useCreateQuiz();
  const createQuestion = useCreateQuestionGenerated();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<{
    question: Question;
    index: number;
  } | null>(null);

  const handleAddQuestion = (question: Question) => {
    addQuestion(question);
    toast.success(t('question-added'));
  };

  const handleEditQuestion = (index: number, question: Question) => {
    updateQuestion(index, question);
    setEditingQuestion(null);
    toast.success(t('question-updated'));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((_, i) => `question-${i}` === active.id);
      const newIndex = questions.findIndex((_, i) => `question-${i}` === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderQuestions(oldIndex, newIndex);
      }
    }
  };

  const handleSubmitQuiz = async () => {
    if (questions.length === 0) {
      toast.error(t('add-at-least-one-question'));
      return;
    }

    setIsSubmitting(true);

    try {
      const quiz = await createQuiz.mutateAsync({
        data: { ...quizMetadata!, isPublished: true },
      });
      const quizId = quiz.id!;

      await Promise.all(
        questions.map((q, index) =>
          createQuestion.mutateAsync({
            id: quizId,
            data: { ...q, position: index + 1 },
          }),
        ),
      );

      reset();
      router.push(ROUTES.QUIZ_LIST);
    } catch {
      toast.error(t('failed-to-create-quiz'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-24">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('add-questions')}</h1>
        <p className="text-muted-foreground">{t('create-quiz-wizard-step-2-description')}</p>
      </div>

      <QuestionForm
        onAdd={handleAddQuestion}
        addQuestionTitle={t('add-question')}
        questionTypeLabel={t('question-type')}
        multipleChoiceLabel={t('multiple-choice')}
        shortAnswerLabel={t('short-answer')}
        questionPromptLabel={t('question-prompt')}
        enterQuestionPlaceholder={t('enter-your-question')}
        optionsLabel={t('options')}
        correctAnswerLabel={t('correct-answer')}
        correctAnswerPlaceholder={t('correct-answer-text')}
        addOptionButton={t('add-option-button')}
        optionPlaceholder={t('add-option-placeholder')}
        selectCorrectHint={t('select-correct-hint')}
        addQuestionButton={t('add-question-button')}
      />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {t('questions-list')} ({questions.length})
        </h2>
        {questions.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            {t('no-questions-added')}
          </p>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={questions.map((_, i) => `question-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {questions.map((q, index) => (
                  <SortableQuestionCard
                    key={`question-${index}`}
                    question={q}
                    index={index}
                    onEdit={(question, idx) => setEditingQuestion({ question, index: idx })}
                    onDelete={removeQuestion}
                    isSubmitting={isSubmitting}
                    translations={{
                      correctAnswer: t('correct-answer'),
                      edit: t('edit'),
                      delete: t('delete'),
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <div className="bg-background fixed right-0 bottom-0 left-0 border-t p-4">
        <div className="mx-auto flex max-w-6xl gap-2">
          <Button variant="outline" className="flex-1" onClick={prevStep} disabled={isSubmitting}>
            {t('back')}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitQuiz}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? t('creating-quiz') : t('submit-quiz', { count: questions.length })}
          </Button>
        </div>
      </div>

      <QuestionEditModal
        isOpen={editingQuestion !== null}
        question={editingQuestion?.question || null}
        questionIndex={editingQuestion?.index || 0}
        onClose={() => setEditingQuestion(null)}
        onSave={handleEditQuestion}
        translations={{
          title: t('edit-question-title', { index: (editingQuestion?.index || 0) + 1 }),
          questionTypeLabel: t('question-type'),
          multipleChoiceLabel: t('multiple-choice'),
          shortAnswerLabel: t('short-answer'),
          questionPromptLabel: t('question-prompt'),
          enterQuestionPlaceholder: t('enter-your-question'),
          optionsLabel: t('options'),
          correctAnswerLabel: t('correct-answer'),
          correctAnswerPlaceholder: t('correct-answer-text'),
          addOptionButton: t('add-option-button'),
          optionPlaceholder: t('add-option-placeholder'),
          selectCorrectHint: t('select-correct-hint'),
          cancelButton: t('cancel'),
          saveButton: t('save-changes'),
        }}
      />
    </div>
  );
}
