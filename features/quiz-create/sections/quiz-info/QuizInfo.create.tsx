'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { Button, FormField, Input } from '@/core/components';
import { quizSchema, type QuizFormValues } from '@/core/schemas';

import { useQuizCreateStore } from '../../store/quiz-create.store';

export function QuizInfo() {
  const t = useTranslations('quiz-maker.builder');
  const { quizMetadata, nextStep } = useQuizCreateStore();

  const { control, handleSubmit } = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: quizMetadata || {
      title: '',
      description: '',
      timeLimitSeconds: 300,
    },
  });

  const onSubmit = (values: QuizFormValues) => {
    nextStep(values);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('create-quiz-wizard-title')}</h1>
        <p className="text-muted-foreground">{t('create-quiz-wizard-step-1-description')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="title"
          control={control}
          label={t('title-label')}
          render={({ field }) => <Input {...field} placeholder={t('title-placeholder')} />}
        />

        <FormField
          name="description"
          control={control}
          label={t('description-label')}
          render={({ field }) => (
            <textarea
              {...field}
              placeholder={t('description-placeholder')}
              className="w-full rounded-xl border p-4"
              rows={4}
            />
          )}
        />

        <FormField
          name="timeLimitSeconds"
          control={control}
          label={t('time-limit-label')}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value ?? ''}
              type="number"
              min={60}
              max={7200}
              onChange={(e) => field.onChange(e.target.valueAsNumber || null)}
            />
          )}
        />

        <Button type="submit" variant="primary" size="lg" className="w-full">
          {t('next-add-questions')}
        </Button>
      </form>
    </div>
  );
}
