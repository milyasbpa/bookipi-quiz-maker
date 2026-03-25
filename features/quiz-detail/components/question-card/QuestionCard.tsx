'use client';

import { Edit, Trash2 } from 'lucide-react';

import type { Question } from '@/core/api/generated/quizMakerAPI.schemas';
import { Button } from '@/core/components';

interface QuestionCardProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (questionId: number) => void;
  translations: {
    answerLabel: string;
    edit: string;
    delete: string;
  };
}

export function QuestionCard({ question, onEdit, onDelete, translations }: QuestionCardProps) {
  // Calculate answer display
  let answerDisplay = '-';

  if (question.type === 'mcq' && question.options) {
    const index =
      typeof question.correctAnswer === 'number'
        ? question.correctAnswer
        : parseInt(String(question.correctAnswer), 10);
    answerDisplay = question.options[index] || '-';
  } else if (question.correctAnswer) {
    answerDisplay = String(question.correctAnswer);
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-mono text-sm">#{question.position}</span>
          <span className="bg-muted rounded-full px-2 py-1 text-xs font-medium uppercase">
            {question.type}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <p className="font-medium">{question.prompt}</p>
      </div>

      <div className="text-muted-foreground mb-4 text-sm">
        <span className="font-medium">{translations.answerLabel}:</span>{' '}
        <span className="line-clamp-2">{answerDisplay}</span>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(question)}
          className="flex-1 gap-1"
        >
          <Edit className="size-3" />
          {translations.edit}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(question.id!)}
          className="text-destructive flex-1 gap-1"
        >
          <Trash2 className="size-3" />
          {translations.delete}
        </Button>
      </div>
    </div>
  );
}
