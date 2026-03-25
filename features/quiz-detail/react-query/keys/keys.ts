export const quizDetailQueryKeys = {
  all: () => ['/quizzes'] as const,
  detail: (id: number) => [`/quizzes/${id}`] as const,
} as const;

export const quizDetailMutationKeys = {
  updateQuiz: (quizId: number) => ['quiz-detail', 'updateQuiz', quizId] as const,
  createQuestion: (quizId: number) => ['quiz-detail', 'createQuestion', quizId] as const,
  updateQuestion: (quizId: number) => ['quiz-detail', 'updateQuestion', quizId] as const,
  deleteQuestion: (quizId: number) => ['quiz-detail', 'deleteQuestion', quizId] as const,
} as const;
