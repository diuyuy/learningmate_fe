import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryKey,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { fetchMyScraps } from '@/features/my/api/scraps';
import type { ScrapPage } from '@/features/my/types/scraps';

// 다양한 서버 키 대응
function hasNext(p: any) {
  return Boolean(p?.hasNext ?? p?.hasNextPage ?? p?.pageInfo?.hasNext);
}
function nextPageFrom(p: any, lastPageParam: unknown) {
  const direct = p?.nextPage ?? p?.pageInfo?.next ?? p?.pageInfo?.nextPage;
  if (typeof direct === 'number') return direct;
  if (typeof lastPageParam === 'number') return lastPageParam + 1;
  if (typeof p?.page === 'number') return p.page + 1;
  return undefined;
}

export type InfiniteScrapsResult = UseInfiniteQueryResult<
  InfiniteData<ScrapPage, number>,
  Error
>;

export function useInfiniteMyScraps(size = 12): InfiniteScrapsResult {
  return useInfiniteQuery<
    ScrapPage,
    Error,
    InfiniteData<ScrapPage, number>,
    QueryKey,
    number
  >({
    queryKey: ['my', 'scraps', { size }],
    queryFn: ({ pageParam = 0 }) => fetchMyScraps(pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (last, _pages, lastParam) =>
      hasNext(last) ? nextPageFrom(last, lastParam) : undefined,
    refetchOnMount: 'always',
    staleTime: 0,
  });
}
