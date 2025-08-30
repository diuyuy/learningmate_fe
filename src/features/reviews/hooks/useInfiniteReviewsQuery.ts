import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/querykeys';
import { fetchReviewsByTodaysKeyword, fetchReviewsByArticle } from '../api/api';
import type { ReviewListPageResponse } from '../types/types';

export function useInfiniteKeywordReviews(keywordId: number) {
  const enabled = Number.isFinite(keywordId) && keywordId > 0;
  return useInfiniteQuery<
    ReviewListPageResponse,
    Error,
    InfiniteData<ReviewListPageResponse>,
    (string | number)[],
    number
  >({
    queryKey: [QUERY_KEYS.REVIEWS, 'keyword', keywordId],
    queryFn: ({ pageParam }) =>
      fetchReviewsByTodaysKeyword({ keywordId, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage?.hasNext ? (lastPage.page ?? 0) + 1 : undefined,
    staleTime: 1000 * 60 * 60 * 24,
    enabled,
  });
}

export function useInfiniteArticleReviews(articleId: number) {
  const enabled = Number.isFinite(articleId) && articleId > 0;
  return useInfiniteQuery<
    ReviewListPageResponse,
    Error,
    InfiniteData<ReviewListPageResponse>,
    (string | number)[],
    number
  >({
    queryKey: [QUERY_KEYS.REVIEWS, 'article', articleId],
    queryFn: ({ pageParam }) =>
      fetchReviewsByArticle({ articleId, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage?.hasNext ? (lastPage.page ?? 0) + 1 : undefined,
    staleTime: 1000 * 60 * 60 * 24,
    enabled,
  });
}
