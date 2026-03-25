'use client';

import { Settings, Play } from 'lucide-react';

import type { QuizWithQuestions } from '@/core/api/generated/quizMakerAPI.schemas';
import { Button } from '@/core/components';

interface QuizCardProps {
  quiz: QuizWithQuestions;
  onNavigateToDetail: (quizId: number) => void;
  onNavigateToPlayer: (quizId: number) => void;
  translations: {
    manageQuestions: string;
    startQuiz: string;
    minutes: string;
  };
}

export function QuizCard({
  quiz,
  onNavigateToDetail,
  onNavigateToPlayer,
  translations,
}: QuizCardProps) {
  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="mb-3 min-w-50">
        <div className="font-semibold">{quiz.title}</div>
        <div className="text-muted-foreground mt-1 line-clamp-2 text-sm">{quiz.description}</div>
      </div>

      {quiz.timeLimitSeconds && (
        <div className="text-muted-foreground mb-4 text-sm">
          ⏱️ {Math.floor(quiz.timeLimitSeconds / 60)} {translations.minutes}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={() => onNavigateToDetail(quiz.id!)}
          variant="outline"
          size="sm"
          title={translations.manageQuestions}
          className="flex-1"
        >
          <Settings className="size-4" />
          <span className="ml-1">{translations.manageQuestions}</span>
        </Button>
        <Button
          onClick={() => onNavigateToPlayer(quiz.id!)}
          variant="primary"
          size="sm"
          title={translations.startQuiz}
          className="flex-1"
        >
          <Play className="size-4" />
          <span className="ml-1">{translations.startQuiz}</span>
        </Button>
      </div>
    </div>
  );
}
