import { QUERY_KEYS } from '@/constants/querykeys';
import { useQuery } from '@tanstack/react-query';
import { fetchTodaysKeyword } from '../api/api';
import { nowKstDateKey } from '@/lib/timezone';

export const useTodaysKeywordQuery = () => {
  const todayKey = nowKstDateKey();

  return useQuery({
    queryKey: [QUERY_KEYS.KEYWORDS, todayKey],
    queryFn: fetchTodaysKeyword,
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};
