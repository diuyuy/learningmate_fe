import { QUERY_KEYS } from '@/constants/querykeys';
import { useQuery } from '@tanstack/react-query';
import { fetchArticlePreviews } from '../api/api';

export const useArticlePreviewsQuery = (keywordId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ARTICLE_PREVIEWS],
    queryFn: async () => {
      return await fetchArticlePreviews(keywordId);
    },
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};
