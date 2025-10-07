import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/querykeys';
import { fetchReviewsByTodaysKeyword, fetchReviewsByArticle } from '../api/api';
import type { ReviewListPageResponse } from '../types/types';

export type InfiniteReviewsResult = UseInfiniteQueryResult<
  InfiniteData<ReviewListPageResponse, number>,
  Error
>;

export function useInfiniteKeywordReviews(
  keywordId: number
): InfiniteReviewsResult {
  const enabled = Number.isFinite(keywordId) && keywordId > 0;

  return useInfiniteQuery<
    ReviewListPageResponse,
    Error,
    InfiniteData<ReviewListPageResponse, number>,
    QueryKey,
    number
  >({
    queryKey: [QUERY_KEYS.REVIEWS, 'keyword', keywordId],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      fetchReviewsByTodaysKeyword({ keywordId, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 60 * 24,
    enabled,
  });
}

export function useInfiniteArticleReviews(
  articleId: number
): InfiniteReviewsResult {
  const enabled = Number.isFinite(articleId) && articleId > 0;

  return useInfiniteQuery<
    ReviewListPageResponse,
    Error,
    InfiniteData<ReviewListPageResponse, number>,
    QueryKey,
    number
  >({
    queryKey: [QUERY_KEYS.REVIEWS, 'article', articleId],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      fetchReviewsByArticle({ articleId, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 60 * 24,
    enabled,
  });
}
