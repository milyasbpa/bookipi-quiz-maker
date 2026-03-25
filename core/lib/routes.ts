export const ROUTES = {
  HOME: '/',
  QUIZ_LIST: '/',
  QUIZ_CREATE: '/quiz/create',
  QUIZ_DETAIL: (quizId: number) => `/quiz/${quizId}`,
  QUIZ_PLAYER: (quizId: number) => `/quiz/${quizId}/player`,
} as const;
