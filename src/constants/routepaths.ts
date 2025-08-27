export const ROUTE_PATHS = {
  MAIN: '/',
  LEARNING: '/learning',
  ARTICLE_DETAIL: (articleId: number) => `/article/${articleId}`,
  MY: '/my',
  LOGIN: '/login',
  SIGNUP: '/signup',
  LANDING: '/landing',
  PASSWORD_RESETS: '/password-resets',
} as const;
