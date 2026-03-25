'use client';

import { useTranslations } from 'next-intl';

import { Edit } from '../sections/edit-quiz';
import { List } from '../sections/list';

export function QuizListContainer() {
  const t = useTranslations('quiz-maker.builder');

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">{t('page-title')}</h1>
        <p className="text-muted-foreground mt-1">{t('page-subtitle')}</p>
      </div>

      <List />

      <Edit />
    </div>
  );
}
