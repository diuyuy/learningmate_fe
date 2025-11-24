import { QUERY_KEYS } from '@/constants/querykeys';
import { useQuery } from '@tanstack/react-query';
import { fetchArtilcesByKeyword } from '../api/api';

export const useArticleListQuery = (keywordId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ARTICLE, { keywordId }],
    queryFn: async () => fetchArtilcesByKeyword(keywordId),
  });
};
