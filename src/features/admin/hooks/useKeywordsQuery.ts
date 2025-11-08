import { QUERY_KEYS } from '@/constants/querykeys';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchKeywordsByPage } from '../api/api';

export const useKeywordsQuery = (
  pageParam: number,
  query: string,
  category: string | null,
  sortOrder: 'asc' | 'desc'
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.KEYWORDS, { pageParam, query, category, sortOrder }],
    queryFn: async () =>
      fetchKeywordsByPage({ pageParam, query, category, sortOrder }),
    placeholderData: keepPreviousData,
  });
};
