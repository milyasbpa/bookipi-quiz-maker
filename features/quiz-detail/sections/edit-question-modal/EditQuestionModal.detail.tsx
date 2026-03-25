'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { Button, Dialog, FormField, Input, MCQOptions } from '@/core/components';

import { useUpdateQuestion } from '../../react-query';
import { questionSchema, type QuestionFormValues } from '../../schemas/add-question-form.schema';
import { useQuizDetailStore } from '../../store/quiz-detail.store';

export function EditQuestionModal() {
  const params = useParams();
  const t = useTranslations('quiz-maker.builder');
  const quizId = Number(params.id);

  const isOpen = useQuizDetailStore((s) => s.isEditQuestionModalOpen);
  const editingQuestion = useQuizDetailStore((s) => s.editingQuestion);
  const closeModal = useQuizDetailStore((s) => s.closeEditQuestionModal);

  const { mutate, isPending } = useUpdateQuestion(quizId);

  const getDefaultValues = useCallback((): QuestionFormValues | undefined => {
    if (!editingQuestion) return undefined;

    const base = {
      type: editingQuestion.type as 'mcq' | 'short',
      prompt: editingQuestion.prompt || '',
      position: editingQuestion.position,
    };

    if (editingQuestion.type === 'mcq') {
      return {
        ...base,
        type: 'mcq',
        options: editingQuestion.options || ['', ''],
        correctAnswer: editingQuestion.correctAnswer || 0,
      };
    } else {
      return {
        ...base,
        type: 'short',
        correctAnswer: (editingQuestion.correctAnswer as string) || '',
      };
    }
  }, [editingQuestion]);

  const { control, handleSubmit, reset, setValue } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: getDefaultValues(),
  });

  const [questionType, setQuestionType] = useState<'mcq' | 'short'>(
    (editingQuestion?.type as 'mcq' | 'short') || 'mcq',
  );
  const [selectedCorrectIndex, setSelectedCorrectIndex] = useState<number>(
    editingQuestion?.type === 'mcq' ? (editingQuestion.correctAnswer as number) || 0 : 0,
  );

  useEffect(() => {
    if (editingQuestion) {
      const defaultValues = getDefaultValues();
      reset(defaultValues);
    }
  }, [editingQuestion, getDefaultValues, reset]);

  const onSubmit = (values: QuestionFormValues) => {
    if (!editingQuestion) return;

    mutate(
      {
        id: editingQuestion.id!,
        data: {
          prompt: values.prompt,
          options: values.type === 'mcq' ? values.options : undefined,
          correctAnswer: values.correctAnswer,
          position: values.position,
        },
      },
      {
        onSuccess: () => {
          closeModal();
        },
      },
    );
  };

  if (!editingQuestion) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeModal}
      title={t('edit-question-modal-title')}
      description={t('edit-question-modal-description')}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="type"
          control={control}
          label={t('question-type')}
          render={({ field }) => (
            <select
              {...field}
              onChange={(e) => {
                const value = e.target.value as 'mcq' | 'short';
                field.onChange(e);
                setQuestionType(value);
                // Reset correct answer when changing to MCQ
                if (value === 'mcq') {
                  setSelectedCorrectIndex(0);
                  setValue('correctAnswer', 0);
                }
              }}
              className="border-border focus-visible:border-ring w-full rounded-xl border bg-transparent p-3 text-sm shadow-xs transition-colors outline-none disabled:opacity-50"
              disabled={true} // Type cannot be changed when editing
            >
              <option value="mcq">{t('question-type-mcq')}</option>
              <option value="short">{t('question-type-short')}</option>
            </select>
          )}
        />

        <FormField
          name="prompt"
          control={control}
          label={t('question-prompt')}
          render={({ field, fieldState }) => (
            <textarea
              {...field}
              placeholder={t('prompt-placeholder')}
              className="border-border focus-visible:border-ring w-full rounded-xl border bg-transparent p-4 text-sm shadow-xs transition-colors outline-none disabled:opacity-50"
              rows={2}
              disabled={isPending}
              aria-invalid={!!fieldState.error}
            />
          )}
        />

        {questionType === 'mcq' && (
          <Controller
            name="options"
            control={control}
            render={({ field }) => (
              <MCQOptions
                options={field.value || []}
                onChange={field.onChange}
                selectedCorrectIndex={selectedCorrectIndex}
                onSelectCorrect={(index) => {
                  setSelectedCorrectIndex(index);
                  setValue('correctAnswer', index);
                }}
                disabled={isPending}
                addOptionButtonLabel={t('add-option-button')}
                optionPlaceholder={t('add-option-placeholder')}
                selectCorrectHint={t('select-correct-hint')}
              />
            )}
          />
        )}

        {questionType === 'short' && (
          <FormField
            name="correctAnswer"
            control={control}
            label={t('correct-answer')}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                value={(field.value as string) || ''}
                placeholder={t('answer-placeholder')}
                disabled={isPending}
                aria-invalid={!!fieldState.error}
              />
            )}
          />
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={closeModal}
            disabled={isPending}
            className="flex-1"
          >
            {t('cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={isPending} className="flex-1">
            {isPending ? t('updating') : t('update-question')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
