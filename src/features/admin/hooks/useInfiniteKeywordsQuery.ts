import { QUERY_KEYS } from '@/constants/querykeys';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchKeywordsByPage } from '../api/api';

export const useInfiniteKeywordsQuery = (initialPageParam: number) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.KEYWORDS],
    queryFn: fetchKeywordsByPage,
    initialPageParam,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext) return null;

      return lastPage.page + 1;
    },
    getPreviousPageParam: (firstPage, _, firstPageParam) => {
      if (firstPageParam === 0) return null;

      return firstPage.page - 1;
    },
  });
};
