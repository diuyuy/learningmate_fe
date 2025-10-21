import { QUERY_KEYS } from '@/constants/querykeys';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchKeywordsByPage } from '../api/api';

export const useKeywordsQuery = (pageParam: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.KEYWORDS, { pageParam }],
    queryFn: async () => fetchKeywordsByPage({ pageParam }),
    placeholderData: keepPreviousData,
  });
};
