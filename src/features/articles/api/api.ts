import { api } from '@/lib/axios';
import type { Article, ArticlePreview } from '../types/types';

export const fetchArticlePreviews = async (keywordId: number) => {
  const response = await api.get(`/keywords/${keywordId}/articles`);

  return response.data.result as ArticlePreview[];
};

export const fetchArticle = async (articleId: number) => {
  const response = await api.get(`/articles/${articleId}`);
  console.log(response.data);

  return response.data.result as Article;
};
