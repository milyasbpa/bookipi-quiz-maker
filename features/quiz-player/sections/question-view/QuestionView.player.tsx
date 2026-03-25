'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { MCQAnswer } from '../../components/mcq-answer';
import { ShortAnswer } from '../../components/short-answer';
import { useGetQuizPlayer } from '../../react-query';
import { usePlayerStore } from '../../store/player.store';

export function QuestionViewPlayer() {
  const t = useTranslations('quiz-maker.player');
  const params = useParams();
  const quizId = Number(params?.id);

  const attemptId = usePlayerStore((s) => s.attemptId);
  const currentQuestionIndex = usePlayerStore((s) => s.currentQuestionIndex);
  const answers = usePlayerStore((s) => s.answers);
  const setAnswer = usePlayerStore((s) => s.setAnswer);

  const { data: quiz } = useGetQuizPlayer(quizId, {
    enabled: !!quizId && !isNaN(quizId) && !!attemptId,
  });

  if (!quiz || !attemptId || !quiz.questions || quiz.questions.length === 0) {
    return null;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;

  if (!currentQuestion) {
    return null;
  }

  const currentAnswer = currentQuestion.id ? answers[currentQuestion.id] || '' : '';

  const handleAnswerChange = (value: string) => {
    if (!currentQuestion.id) return;

    // Only update local Zustand state
    // No API call - answers will be saved on submit
    setAnswer(currentQuestion.id, value);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="text-foreground text-xl font-semibold">
            {t('question')} {currentQuestionIndex + 1} {t('of')} {totalQuestions}
          </h2>
          <span className="text-muted-foreground bg-accent rounded-full px-3 py-1 text-sm">
            {currentQuestion.type?.toUpperCase() || t('type-na')}
          </span>
        </div>

        <p className="text-foreground text-lg">{currentQuestion.prompt}</p>
      </div>

      <div>
        {currentQuestion.type === 'mcq' && currentQuestion.options && (
          <MCQAnswer
            options={currentQuestion.options}
            selectedValue={currentAnswer}
            onChange={handleAnswerChange}
          />
        )}

        {currentQuestion.type === 'short' && (
          <ShortAnswer
            value={currentAnswer}
            onChange={handleAnswerChange}
            placeholder={t('answer-placeholder')}
          />
        )}
      </div>
    </div>
  );
}
