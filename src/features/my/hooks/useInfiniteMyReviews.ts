// src/features/my/hooks/useInfiniteMyReviews.ts
import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/querykeys';
import {
  fetchMyReviews,
  type MyReviewsParams,
} from '@/features/my/api/myReviews';
import type { ReviewListPageResponse } from '@/features/reviews/types/types';

export type InfiniteMyReviewsResult = UseInfiniteQueryResult<
  InfiniteData<ReviewListPageResponse, number>,
  Error
>;
export type MyReviewSort = 'latest' | 'liked';

function hasNext(p: any) {
  return Boolean(p?.hasNext ?? p?.hasNextPage ?? p?.pageInfo?.hasNext);
}

function nextPageFrom(p: any, lastPageParam: unknown) {
  const direct = p?.nextPage ?? p?.pageInfo?.next ?? p?.pageInfo?.nextPage;
  if (typeof direct === 'number') return direct;
  if (typeof lastPageParam === 'number') return lastPageParam + 1;
  if (typeof p?.page === 'number') return p.page + 1;
  return undefined;
}

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
    queryFn: ({ pageParam = 0 }) =>
      fetchMyReviews({ page: pageParam, size, sort } as MyReviewsParams),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      hasNext(lastPage) ? nextPageFrom(lastPage, lastPageParam) : undefined,

    // ✅ 진입/포커스/재연결 시 최신화
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    // ✅ 항상 stale 취급 → 바로 refetch (동일 데이터면 React Query가 렌더 최소화)
    staleTime: 0,
    // 정렬 바꿀 때 이전 페이지 잠깐 유지하고 싶으면 아래 주석 해제
    // placeholderData: (prev) => prev,
  });
}
