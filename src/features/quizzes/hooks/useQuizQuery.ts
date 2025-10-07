
import { QUERY_KEYS } from '@/constants/querykeys';
import { useQuery } from '@tanstack/react-query';
import { fetchQuizzes } from '../api/api';

export const useQuizQuery = (articleId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.QUIZZES, articleId],
    queryFn: async () => {
      return await fetchQuizzes(articleId);
    },
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};
