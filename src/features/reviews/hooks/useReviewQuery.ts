import { QUERY_KEYS } from '@/constants/querykeys';
import { useQuery } from '@tanstack/react-query';
import { fetchReview } from '../api/api';

export const useReviewQuery = (articleId: number, memberId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEW, articleId, memberId],
    queryFn: async () => {
      const data = await fetchReview(articleId, memberId);
      return data ?? null;
    },
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};