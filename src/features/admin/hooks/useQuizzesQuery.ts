import { QUERY_KEYS } from '@/constants/querykeys';
import { useQuery } from '@tanstack/react-query';
import { fetchQuizDetails } from '../api/api';

export const useQuizzesQuery = (articleId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.QUIZZES, { articleId }],
    queryFn: async () => fetchQuizDetails(articleId),
  });
};
