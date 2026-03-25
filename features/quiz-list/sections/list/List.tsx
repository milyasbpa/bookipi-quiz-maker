'use client';

import { Plus, ListPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo, useCallback } from 'react';

import { Button, EmptyState, LoadingState } from '@/core/components';
import { ROUTES } from '@/core/lib/routes';

import { QuizTable, QuizCard } from '../../components';
import { useGetQuizzes } from '../../react-query/hooks';
import { useQuizListTable } from '../../react-table';

export function List() {
  const t = useTranslations('quiz-maker.builder');
  const router = useRouter();
  const { data, isLoading } = useGetQuizzes();

  const quizzes = useMemo(() => (data || []).filter((quiz) => quiz.id !== undefined), [data]);
  const table = useQuizListTable(quizzes);

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

  const cardTranslations = useMemo(
    () => ({
      manageQuestions: t('manage-questions'),
      startQuiz: t('start-quiz'),
      minutes: t('minutes'),
    }),
    [t],
  );

  if (isLoading) {
    return <LoadingState message={t('loading-quizzes')} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button onClick={() => router.push(ROUTES.QUIZ_CREATE)} variant="primary" size="lg">
          <Plus className="mr-2 size-4" />
          {t('create-quiz')}
        </Button>
      </div>

      {quizzes.length === 0 && (
        <EmptyState
          icon={<ListPlus />}
          title={t('no-quizzes-yet')}
          description={t('no-quizzes-description')}
          action={
            <Button onClick={() => router.push(ROUTES.QUIZ_CREATE)} variant="primary">
              <Plus className="mr-2 size-4" />
              {t('create-first-quiz')}
            </Button>
          }
          className="border-2 border-dashed"
        />
      )}

      {quizzes.length > 0 && (
        <>
          <QuizTable table={table} />

          <div className="space-y-4 md:hidden">
            {table.getRowModel().rows.map((row) => (
              <QuizCard
                key={row.id}
                quiz={row.original}
                onNavigateToDetail={handleNavigateToDetail}
                onNavigateToPlayer={handleNavigateToPlayer}
                translations={cardTranslations}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
