'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, GripVertical, Trash2 } from 'lucide-react';

import { Button } from '@/core/components';

import type { Question } from '../../store/quiz-create.store';

interface SortableQuestionItemProps {
  question: Question;
  index: number;
  onEdit: (question: Question, index: number) => void;
  onDelete: (index: number) => void;
  isSubmitting: boolean;
  translations: {
    correctAnswer: string;
    edit: string;
    delete: string;
  };
}

export function SortableQuestionItem({
  question,
  index,
  onEdit,
  onDelete,
  isSubmitting,
  translations,
}: SortableQuestionItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `question-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-background flex items-start gap-2 rounded-lg border p-4"
    >
      <button
        type="button"
        className="mt-1 cursor-grab touch-none active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="text-muted-foreground size-5" />
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">#{index + 1}</span>
          <span className="text-muted-foreground text-xs uppercase">{question.type}</span>
        </div>
        <p className="mt-1 text-sm font-medium">{question.prompt}</p>

        {/* MCQ Options with correct answer highlight */}
        {question.type === 'mcq' && question.options && (
          <div className="mt-2 space-y-1">
            {question.options.map((opt, i) => (
              <div
                key={i}
                className={`border-l-2 pl-3 text-xs ${
                  i === question.correctAnswer
                    ? 'border-green-500 font-medium text-green-700'
                    : 'text-muted-foreground border-gray-300'
                }`}
              >
                {i === question.correctAnswer && '✓ '}
                {opt}
              </div>
            ))}
          </div>
        )}

        {/* Short Answer */}
        {question.type === 'short' && (
          <div className="mt-2 border-l-2 border-green-500 pl-3 text-xs">
            <span className="text-muted-foreground">{translations.correctAnswer}:</span>{' '}
            <span className="font-medium text-green-700">{question.correctAnswer}</span>
          </div>
        )}
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(question, index)}
          disabled={isSubmitting}
          title={translations.edit}
        >
          <Edit className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(index)}
          disabled={isSubmitting}
          title={translations.delete}
        >
          <Trash2 className="text-destructive size-4" />
        </Button>
      </div>
    </div>
  );
}
