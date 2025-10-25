export const ROUTE_PATHS = {
  MAIN: '/main',
  LEARNING: '/learning',
  ARTICLE_DETAIL: (articleId: number) => `/article/${articleId}`,
  MY: '/my',
  LOGIN: '/login',
  SIGNUP: '/signup',
  LANDING: '/',
  PASSWORD_RESETS: '/password-resets',
  EDIT_ARTICLE: (keywordId: number, articleId: number) =>
    `/admin/keywords/${keywordId}/articles/${articleId}`,
  ADMIN: '/admin',
} as const;
