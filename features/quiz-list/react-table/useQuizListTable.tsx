'use no memo';

import { useReactTable, getCoreRowModel, createColumnHelper } from '@tanstack/react-table';
import { Play, Pencil, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo, useCallback } from 'react';

import type { QuizWithQuestions } from '@/core/api/generated/quizMakerAPI.schemas';
import { Button } from '@/core/components';
import { ROUTES } from '@/core/lib/routes';

import { useQuizListStore } from '../store';

const columnHelper = createColumnHelper<QuizWithQuestions>();

export function useQuizListTable(quizzes: QuizWithQuestions[]) {
  const t = useTranslations('quiz-maker.builder');
  const router = useRouter();
  const openEditModal = useQuizListStore((s) => s.openEditModal);

  // Memoize navigation handlers to prevent re-renders
  const handleNavigateToDetail = useCallback(
    (quizId: number) => {
      router.push(ROUTES.QUIZ_DETAIL(quizId));
    },
    [router],
  );

  const handleNavigateToPlayer = useCallback(
    (quizId: number) => {
      router.push(ROUTES.QUIZ_PLAYER(quizId));
    },
    [router],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: t('quiz-title'),
        cell: (info) => (
          <div className="min-w-50">
            <div className="font-semibold">{info.getValue()}</div>
            <div className="text-muted-foreground mt-1 line-clamp-2 text-sm">
              {info.row.original.description}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('timeLimitSeconds', {
        header: t('time-limit'),
        cell: (info) => {
          const seconds = info.getValue();
          if (!seconds) return <span className="text-muted-foreground text-sm">-</span>;
          return (
            <span className="text-sm">
              {Math.floor(seconds / 60)} {t('minutes')}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: t('actions'),
        cell: (info) => {
          const quiz = info.row.original;

          return (
            <div className="flex gap-2">
              <Button
                onClick={() => handleNavigateToDetail(quiz.id!)}
                variant="outline"
                size="sm"
                title={t('manage-questions')}
              >
                <Settings className="size-4" />
              </Button>
              <Button
                onClick={() =>
                  openEditModal(quiz.id!, {
                    title: quiz.title!,
                    description: quiz.description!,
                    timeLimitSeconds: quiz.timeLimitSeconds ?? undefined,
                  })
                }
                variant="outline"
                size="sm"
                title={t('edit')}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                onClick={() => handleNavigateToPlayer(quiz.id!)}
                variant="primary"
                size="sm"
                title={t('start-quiz')}
              >
                <Play className="size-4" />
              </Button>
            </div>
          );
        },
      }),
    ],
    [t, openEditModal, handleNavigateToDetail, handleNavigateToPlayer],
  );

  const table = useReactTable({
    data: quizzes,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return table;
}
