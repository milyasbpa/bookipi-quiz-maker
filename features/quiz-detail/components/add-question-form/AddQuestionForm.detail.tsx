'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { Button } from '@/core/components';
import { FormField } from '@/core/components';
import { Input } from '@/core/components';
import { MCQOptions } from '@/core/components';

import { questionSchema, type QuestionFormValues } from '../../schemas/add-question-form.schema';

interface AddQuestionFormProps {
  onSubmit: (values: QuestionFormValues, reset: () => void) => void;
  isPending?: boolean;

  // Labels
  questionTypeLabel: string;
  questionTypeMcq: string;
  questionTypeShort: string;
  questionPromptLabel: string;
  promptPlaceholder: string;
  correctAnswerLabel: string;
  answerPlaceholder: string;
  addOptionButton: string;
  optionPlaceholder: string;
  selectCorrectHint: string;
  addButtonLabel: string;
  addingLabel: string;
}

export function AddQuestionForm({
  onSubmit,
  isPending = false,
  questionTypeLabel,
  questionTypeMcq,
  questionTypeShort,
  questionPromptLabel,
  promptPlaceholder,
  correctAnswerLabel,
  answerPlaceholder,
  addOptionButton,
  optionPlaceholder,
  selectCorrectHint,
  addButtonLabel,
  addingLabel,
}: AddQuestionFormProps) {
  const { control, handleSubmit, reset, setValue } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      type: 'mcq',
      prompt: '',
      options: ['', ''],
      correctAnswer: '',
    },
  });

  const [questionType, setQuestionType] = useState<'mcq' | 'short'>('mcq');
  const [selectedCorrectIndex, setSelectedCorrectIndex] = useState<number>(0);

  const handleFormSubmit = (values: QuestionFormValues) => {
    onSubmit(values, reset);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <FormField
        name="type"
        control={control}
        label={questionTypeLabel}
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
            disabled={isPending}
          >
            <option value="mcq">{questionTypeMcq}</option>
            <option value="short">{questionTypeShort}</option>
          </select>
        )}
      />

      <FormField
        name="prompt"
        control={control}
        label={questionPromptLabel}
        render={({ field, fieldState }) => (
          <textarea
            {...field}
            placeholder={promptPlaceholder}
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
              addOptionButtonLabel={addOptionButton}
              optionPlaceholder={optionPlaceholder}
              selectCorrectHint={selectCorrectHint}
            />
          )}
        />
      )}

      {questionType === 'short' && (
        <FormField
          name="correctAnswer"
          control={control}
          label={correctAnswerLabel}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              value={(field.value as string) || ''}
              placeholder={answerPlaceholder}
              disabled={isPending}
              aria-invalid={!!fieldState.error}
            />
          )}
        />
      )}

      <Button type="submit" variant="primary" disabled={isPending} className="w-full">
        {isPending ? addingLabel : addButtonLabel}
      </Button>
    </form>
  );
}
