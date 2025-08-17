import { QUERY_KEYS } from '@/constants/querykeys';
import { useQuery } from '@tanstack/react-query';
import { fetchTodaysKeyword } from '../api/api';

export const useTodaysKeywordQuery = () => {
  const today = new Date();

  return useQuery({
    queryKey: [QUERY_KEYS.KEYWORDS, today.toLocaleDateString()],
    queryFn: fetchTodaysKeyword,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};
