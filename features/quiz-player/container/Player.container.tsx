'use client';

import { useAntiCheat } from '../hooks';
import { NavigationPlayer } from '../sections/navigation/Navigation.player';
import { QuestionViewPlayer } from '../sections/question-view/QuestionView.player';
import { QuizHeaderPlayer } from '../sections/quiz-header/QuizHeader.player';
import { AntiCheatSummaryPlayer } from '../sections/results-anti-cheat-summary';
import { ResultsFooter } from '../sections/results-footer';
import { QuestionBreakdownPlayer } from '../sections/results-question-breakdown';
import { ScoreCardPlayer } from '../sections/results-score-card';
import { usePlayerStore } from '../store/player.store';

export function PlayerContainer() {
  const phase = usePlayerStore((s) => s.phase);
  const attemptId = usePlayerStore((s) => s.attemptId);
  const antiCheatEvents = usePlayerStore((s) => s.antiCheatEvents);

  useAntiCheat({ attemptId, enabled: phase === 'playing' });

  if (phase === 'playing') {
    return (
      <div className="container mx-auto max-w-6xl space-y-8 p-6">
        <QuizHeaderPlayer />
        <QuestionViewPlayer />
        <NavigationPlayer />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-8 p-6">
      <ScoreCardPlayer />
      <QuestionBreakdownPlayer />
      <AntiCheatSummaryPlayer events={antiCheatEvents} />
      <ResultsFooter />
    </div>
  );
}
