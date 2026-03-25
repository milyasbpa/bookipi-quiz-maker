export const quizCreateQueryKeys = {
  all: () => ['/quizzes'] as const,
  detail: (id: number) => [`/quizzes/${id}`] as const,
} as const;

export const quizCreateMutationKeys = {
  createQuiz: () => ['quiz-create', 'createQuiz'] as const,
  createQuestion: (quizId: number) => ['quiz-create', 'createQuestion', quizId] as const,
} as const;
