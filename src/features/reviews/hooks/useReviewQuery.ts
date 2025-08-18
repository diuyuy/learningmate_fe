import { QUERY_KEYS } from '@/constants/querykeys';
import { useQuery } from '@tanstack/react-query';
import { fetchReview } from '../api/api';
import type { ReviewProps } from '../types/types';

export const useReviewQuery = ({ articleId, page, size }: ReviewProps) => {
  return useQuery({
    queryKey: [QUERY_KEYS.REVIEWS, articleId, size],
    queryFn: async () => await fetchReview({ articleId, page, size }),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 10 * 60 * 60,
  });
};
