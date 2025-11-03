import { QUERY_KEYS } from '@/constants/querykeys';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchKeywordsByPage } from '../api/api';

export const useKeywordsQuery = (pageParam: number, query: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.KEYWORDS, { pageParam, query }],
    queryFn: async () => fetchKeywordsByPage({ pageParam, query }),
    placeholderData: keepPreviousData,
  });
};
