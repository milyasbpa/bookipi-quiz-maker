'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button, Dialog, FormField, Input } from '@/core/components';
import { quizSchema, type QuizFormValues } from '@/core/schemas';

import { useUpdateQuiz } from '../../react-query';
import { useQuizDetailStore } from '../../store/quiz-detail.store';

export function Edit() {
  const params = useParams();
  const quizId = Number(params.id);
  const t = useTranslations('quiz-maker.builder');

  // Store integration
  const isOpen = useQuizDetailStore((s) => s.isEditQuizModalOpen);
  const closeModal = useQuizDetailStore((s) => s.closeEditQuizModal);
  const editQuizData = useQuizDetailStore((s) => s.editQuizData);

  // API integration
  const { mutate, isPending } = useUpdateQuiz();

  // Form state
  const { control, handleSubmit, reset } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      timeLimitSeconds: 300,
    },
  });

  // Pre-fill form when modal opens
  useEffect(() => {
    if (editQuizData) {
      reset({
        title: editQuizData.title,
        description: editQuizData.description,
        timeLimitSeconds: editQuizData.timeLimitSeconds ?? 300,
      });
    }
  }, [editQuizData, reset]);

  const onSubmit = (values: QuizFormValues) => {
    if (!quizId) return;
    // Always send isPublished: true to API
    mutate({ id: quizId, data: { ...values, isPublished: true } });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeModal}
      title={t('edit-quiz-modal-title')}
      description={t('edit-quiz-modal-description')}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="title"
          control={control}
          label={t('title-label')}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              placeholder={t('title-placeholder')}
              disabled={isPending}
              aria-invalid={!!fieldState.error}
            />
          )}
        />

        <FormField
          name="description"
          control={control}
          label={t('description-label')}
          render={({ field, fieldState }) => (
            <textarea
              {...field}
              placeholder={t('description-placeholder')}
              disabled={isPending}
              className="border-border focus-visible:border-ring w-full rounded-xl border bg-transparent p-4 text-sm shadow-xs transition-colors outline-none disabled:opacity-50"
              rows={3}
              aria-invalid={!!fieldState.error}
            />
          )}
        />

        <FormField
          name="timeLimitSeconds"
          control={control}
          label={t('time-limit-label')}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              value={field.value ?? ''}
              type="number"
              min={60}
              max={7200}
              disabled={isPending}
              onChange={(e) => field.onChange(e.target.valueAsNumber || null)}
              aria-invalid={!!fieldState.error}
            />
          )}
        />

        <Button type="submit" variant="primary" size="lg" disabled={isPending} className="w-full">
          {isPending ? t('updating') : t('update-quiz')}
        </Button>
      </form>
    </Dialog>
  );
}
