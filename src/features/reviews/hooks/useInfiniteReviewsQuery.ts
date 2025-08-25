import { QUERY_KEYS } from '@/constants/querykeys';
import { useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';
import { fetchReviewsByArticle, fetchReviewsByTodaysKeyword } from '../api/api';
import type { Review } from '../types/types';

const SIZE = 10;

export function useInfiniteKeywordReviews(keywordId: number) {
  return useInfiniteQuery<
    Review[],
    Error,
    InfiniteData<Review[], number>,
    (string | number)[],
    number
  >({
    queryKey: [QUERY_KEYS.REVIEWS, keywordId],
    queryFn: ({ pageParam }) =>
      fetchReviewsByTodaysKeyword({ keywordId, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < SIZE) return undefined;
      return allPages.length;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useInfiniteArticleReviews(articleId: number) {
  return useInfiniteQuery<
    Review[],
    Error,
    InfiniteData<Review[], number>,
    (string | number)[],
    number
  >({
    queryKey: [QUERY_KEYS.REVIEWS, articleId],
    queryFn: ({ pageParam }) =>
      fetchReviewsByArticle({ articleId, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < SIZE) return undefined;
      return allPages.length;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}
