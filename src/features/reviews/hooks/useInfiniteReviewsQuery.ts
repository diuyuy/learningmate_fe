import { QUERY_KEYS } from '@/constants/querykeys';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchReviews } from '../api/api';

const SIZE = 10;

export function useInfiniteReviews(keywordId: number) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.REVIEWS, keywordId],
    queryFn: ({ pageParam }) => fetchReviews({ keywordId, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < SIZE) return undefined;
      return allPages.length;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}
