'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/core/components';
import { ROUTES } from '@/core/lib/routes';

import { usePlayerStore } from '../../store/player.store';

export function ResultsFooter() {
  const router = useRouter();
  const t = useTranslations('quiz-maker.results');
  const resetPlayer = usePlayerStore((s) => s.resetPlayer);

  const handleBackToQuizList = () => {
    resetPlayer();
    router.push(ROUTES.QUIZ_LIST);
  };

  return (
    <div className="flex justify-center">
      <Button onClick={handleBackToQuizList} variant="outline" size="lg">
        {t('back-to-quiz-list')}
      </Button>
    </div>
  );
}
