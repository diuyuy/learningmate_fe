import { QUERY_KEYS } from '@/constants/querykeys';
import { useQuery } from '@tanstack/react-query';
import { fetchReview } from '../api/api';

export const useReviewQuery = (articleId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEW, articleId],
    queryFn: async () => {
      const data = await fetchReview(articleId);
      return data ?? null;
    },
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};