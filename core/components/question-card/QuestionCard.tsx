'use client';

import { Edit, Trash2 } from 'lucide-react';

import type { Question } from '@/core/api/generated/quizMakerAPI.schemas';
import { Button } from '@/core/components';

interface QuestionCardProps {
  question: Question;
  displayNumber?: number;
  showAllOptions?: boolean;
  onEdit: (question: Question) => void;
  onDelete: (questionId: number) => void;
  disabled?: boolean;
  translations: {
    answerLabel?: string;
    correctAnswer?: string;
    edit: string;
    delete: string;
  };
}

export function QuestionCard({
  question,
  displayNumber,
  showAllOptions = false,
  onEdit,
  onDelete,
  disabled = false,
  translations,
}: QuestionCardProps) {
  const questionNumber = displayNumber ?? question.position ?? 0;

  const correctAnswerIndex =
    question.type === 'mcq' && typeof question.correctAnswer === 'number'
      ? question.correctAnswer
      : question.type === 'mcq' && question.correctAnswer
        ? parseInt(String(question.correctAnswer), 10)
        : -1;

  let answerDisplay = '-';
  if (question.type === 'mcq' && question.options && correctAnswerIndex >= 0) {
    answerDisplay = question.options[correctAnswerIndex] || '-';
  } else if (question.correctAnswer) {
    answerDisplay = String(question.correctAnswer);
  }

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-muted-foreground font-mono text-sm">#{questionNumber}</span>
        <span className="bg-muted rounded-full px-2 py-1 text-xs font-medium uppercase">
          {question.type}
        </span>
      </div>

      <div className="mb-3">
        <p className="font-medium">{question.prompt}</p>
      </div>

      {showAllOptions && question.type === 'mcq' && question.options ? (
        <div className="mb-4 space-y-1">
          {question.options.map((opt, i) => (
            <div
              key={i}
              className={`border-l-2 pl-3 text-xs ${
                i === correctAnswerIndex
                  ? 'border-green-500 font-medium text-green-700'
                  : 'text-muted-foreground border-gray-300'
              }`}
            >
              {i === correctAnswerIndex && (
                <span className="text-muted-foreground">{`${translations.correctAnswer}: `}</span>
              )}
              {opt}
            </div>
          ))}
        </div>
      ) : question.type === 'short' && showAllOptions ? (
        <div className="mb-4 border-l-2 border-green-500 pl-3 text-xs">
          <span className="text-muted-foreground">{translations.correctAnswer}:</span>{' '}
          <span className="font-medium text-green-700">{question.correctAnswer}</span>
        </div>
      ) : (
        <div className="text-muted-foreground mb-4 text-sm">
          <span className="font-medium">{translations.answerLabel}:</span>{' '}
          <span className="line-clamp-2">{answerDisplay}</span>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(question)}
          disabled={disabled}
          className="flex-1 gap-1"
        >
          <Edit className="size-3" />
          {translations.edit}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(question.id!)}
          disabled={disabled}
          className="text-destructive flex-1 gap-1"
        >
          <Trash2 className="size-3" />
          {translations.delete}
        </Button>
      </div>
    </div>
  );
}
