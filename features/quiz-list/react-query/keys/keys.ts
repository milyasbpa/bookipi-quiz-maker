export const quizListQueryKeys = {
  all: () => ['/quizzes'] as const,
  detail: (id: number) => [`/quizzes/${id}`] as const,
} as const;

export const quizListMutationKeys = {
  createQuiz: () => ['quiz-list', 'createQuiz'] as const,
  updateQuiz: () => ['quiz-list', 'updateQuiz'] as const,
  createQuestion: (quizId: number) => ['quiz-list', 'createQuestion', quizId] as const,
  updateQuestion: (quizId: number) => ['quiz-list', 'updateQuestion', quizId] as const,
  deleteQuestion: (quizId: number) => ['quiz-list', 'deleteQuestion', quizId] as const,
} as const;

