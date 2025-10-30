// src/features/my/hooks/useInfiniteMyReviews.ts
import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/querykeys';
import { fetchMyReviews } from '@/features/my/api/myReviews';
import type { ReviewListPageResponse } from '@/features/reviews/types/types';

export type InfiniteMyReviewsResult = UseInfiniteQueryResult<
  InfiniteData<ReviewListPageResponse, number>,
  Error
>;
export type MyReviewSort = 'latest' | 'liked';

export function useInfiniteMyReviews(
  sort: MyReviewSort = 'latest',
  size = 10
): InfiniteMyReviewsResult {
  return useInfiniteQuery<
    ReviewListPageResponse,
    Error,
    InfiniteData<ReviewListPageResponse, number>,
    QueryKey,
    number
  >({
    queryKey: [QUERY_KEYS.REVIEWS, 'me', { sort, size }],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      fetchMyReviews({ page: pageParam, size, sort }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,

    // ✅ 진입/포커스/재연결 시 최신화
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    // ✅ 항상 stale 취급 → 바로 refetch
    staleTime: 0,
  });
}
