'use client';
'use no memo';

import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo, useState, useCallback } from 'react';

import { Button, ConfirmationDialog } from '@/core/components';

import { SortableQuestionCardDetail } from '../../components';
import { useGetQuizDetail, useDeleteQuestion, useUpdateQuestion } from '../../react-query';
import { useQuizDetailStore } from '../../store/quiz-detail.store';

export function QuestionList() {
  const params = useParams();
  const t = useTranslations('quiz-maker.builder');
  const quizId = Number(params.id);

  const { data: quiz, isLoading } = useGetQuizDetail(quizId);
  const deleteQuestion = useDeleteQuestion(quizId);
  const updateQuestion = useUpdateQuestion(quizId);
  const { openEditQuestionModal, openAddQuestionModal } = useQuizDetailStore();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);

  const questions = useMemo(() => quiz?.questions || [], [quiz?.questions]);

  const handleDeleteClick = useCallback((questionId: number) => {
    setQuestionToDelete(questionId);
    setDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDelete = () => {
    if (questionToDelete) {
      deleteQuestion.mutate({ id: questionToDelete });
      setQuestionToDelete(null);
    }
  };

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const oldIndex = questions.findIndex((q) => `question-${q.id}` === active.id);
      const newIndex = questions.findIndex((q) => `question-${q.id}` === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      // Create new array with reordered questions
      const reorderedQuestions = [...questions];
      const [movedQuestion] = reorderedQuestions.splice(oldIndex, 1);
      reorderedQuestions.splice(newIndex, 0, movedQuestion);

      // Update position for the moved question
      updateQuestion.mutate({
        id: movedQuestion.id!,
        data: {
          position: newIndex + 1,
        },
      });
    },
    [questions, updateQuestion],
  );

  const cardTranslations = useMemo(
    () => ({
      correctAnswer: t('correct-answer'),
      edit: t('edit'),
      delete: t('delete'),
    }),
    [t],
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="bg-muted h-10 w-full animate-pulse rounded" />
        <div className="bg-muted h-20 w-full animate-pulse rounded" />
        <div className="bg-muted h-20 w-full animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {t('questions-list')} ({questions.length})
        </h2>
        <Button variant="primary" onClick={openAddQuestionModal} className="gap-2">
          <Plus className="size-4" />
          {t('add-question')}
        </Button>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-muted-foreground">{t('no-questions')}</p>
          <Button variant="outline" onClick={openAddQuestionModal} className="mt-4 gap-2">
            <Plus className="size-4" />
            {t('add-first-question')}
          </Button>
        </div>
      ) : (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={questions.map((q) => `question-${q.id}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {questions.map((question) => (
                <SortableQuestionCardDetail
                  key={`question-${question.id}`}
                  question={question}
                  onEdit={openEditQuestionModal}
                  onDelete={handleDeleteClick}
                  translations={cardTranslations}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        message={t('delete-confirm')}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
