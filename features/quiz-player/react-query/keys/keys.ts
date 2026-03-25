export const quizPlayerQueryKeys = {
  quiz: (quizId: number) => [`/quizzes/${quizId}`] as const,
  attempt: (attemptId: number) => [`/attempts/${attemptId}`] as const,
} as const;

export const quizPlayerMutationKeys = {
  startAttempt: (quizId: number) => ['quiz-player', 'startAttempt', quizId] as const,
  answerQuestion: (attemptId: number) => ['quiz-player', 'answerQuestion', attemptId] as const,
  submitAttempt: (attemptId: number) => ['quiz-player', 'submitAttempt', attemptId] as const,
  recordEvent: (attemptId: number) => ['quiz-player', 'recordEvent', attemptId] as const,
} as const;
