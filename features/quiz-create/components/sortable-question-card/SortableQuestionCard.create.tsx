'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import type { Question as APIQuestion } from '@/core/api/generated/quizMakerAPI.schemas';
import { QuestionCard } from '@/core/components';

import type { Question } from '../../store/quiz-create.store';

interface SortableQuestionCardProps {
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

export function SortableQuestionCard({
  question,
  index,
  onEdit,
  onDelete,
  isSubmitting,
  translations,
}: SortableQuestionCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `question-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Convert store Question to API Question format
  const apiQuestion: APIQuestion = {
    ...question,
    position: index + 1,
    // Ensure id exists (may be undefined for new questions)
    id: undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-2">
      {/* Drag Handle */}
      <button
        type="button"
        className="mt-4 cursor-grab touch-none active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="text-muted-foreground size-5" />
      </button>

      <div className="flex-1">
        <QuestionCard
          question={apiQuestion}
          displayNumber={index + 1}
          showAllOptions
          onEdit={() => onEdit(question, index)}
          onDelete={() => onDelete(index)}
          disabled={isSubmitting}
          translations={{
            correctAnswer: translations.correctAnswer,
            edit: translations.edit,
            delete: translations.delete,
          }}
        />
      </div>
    </div>
  );
}
