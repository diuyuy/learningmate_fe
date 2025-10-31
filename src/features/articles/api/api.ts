import { api } from '@/lib/axios';
import type { Article, ArticlePreview } from '../types/types';

export const fetchArticlePreviews = async (keywordId: number) => {
  const response = await api.get(`/keywords/${keywordId}/articles`);

  return response.data.result as ArticlePreview[];
};

export const fetchArticle = async (articleId: number) => {
  const response = await api.get(`/articles/${articleId}`);

  return response.data.result as Article;
};

/** ✅ 스크랩 추가 */
export const postArticleScrap = async (articleId: number) => {
  const res = await api.post(`/articles/${articleId}/article-scraps`);
  return res.data;
};

/** ✅ 스크랩 취소 */
export const deleteArticleScrap = async (articleId: number) => {
  const res = await api.delete(`/articles/${articleId}/article-scraps`);
  return res.data;
};
