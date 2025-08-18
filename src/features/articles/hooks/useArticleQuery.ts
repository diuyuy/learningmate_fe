import { QUERY_KEYS } from '@/constants/querykeys';
import { useQuery } from '@tanstack/react-query';
import { fetchArticle } from '../api/api';

export const useArticleQuery = (articleId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ARTICLE, articleId],
    queryFn: async () => await fetchArticle(articleId),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 10 * 60 * 60,
  });
};
