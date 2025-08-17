import { api } from '@/lib/axios';
import type { ArticlePreview } from '../types/types';

export const fetchArticlePreviews = async (keywordId: number) => {
  const response = await api.get(`/keywords/${keywordId}/articles`);

  return response.data.result as ArticlePreview[];
};
