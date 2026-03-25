'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import type { Question } from '@/core/api/generated/quizMakerAPI.schemas';
import { QuestionCard } from '@/core/components';

interface SortableQuestionCardDetailProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (questionId: number) => void;
  translations: {
    correctAnswer: string;
    edit: string;
    delete: string;
  };
}

export function SortableQuestionCardDetail({
  question,
  onEdit,
  onDelete,
  translations,
}: SortableQuestionCardDetailProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `question-${question.id}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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
          question={question}
          showAllOptions
          onEdit={onEdit}
          onDelete={onDelete}
          translations={translations}
        />
      </div>
    </div>
  );
}
