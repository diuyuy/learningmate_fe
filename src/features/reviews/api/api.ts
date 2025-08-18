import { api } from '@/lib/axios';
import type { Review, ReviewProps } from '../types/types';

export const fetchReview = async ({ articleId, page, size }: ReviewProps) => {
  const response = await api.get(
    `/articles/${articleId}/reviews?page=${page}&size=${size}&sort=updatedAt,desc`
  );

  return response.data.result as Review[];
};
