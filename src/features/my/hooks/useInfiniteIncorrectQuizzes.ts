import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
  type QueryKey,
} from '@tanstack/react-query';
import { fetchIncorrectQuizzes } from '@/features/my/api/quiz';
import type { IncorrectQuizPage } from '@/features/my/types/quiz';

// 리스트 페이지네이션 응답이 다양한 키를 가질 수 있으므로 유연하게 처리
function getHasNext(p: any): boolean {
  return Boolean(
    p?.hasNext ??
      p?.hasNextPage ??
      p?.pageInfo?.hasNext ??
      p?.pageInfo?.hasNextPage ??
      false
  );
}
function getNextPage(p: any, lastPageParam: unknown): number | undefined {
  const direct =
    p?.nextPage ?? p?.pageInfo?.next ?? p?.pageInfo?.nextPage ?? undefined;

  if (typeof direct === 'number') return direct;

  // fallback: lastPageParam 숫자면 +1, 아니면 p.page 기반
  if (typeof lastPageParam === 'number') return lastPageParam + 1;

  if (typeof p?.page === 'number') return p.page + 1;

  // 최후의 수단: undefined → 더 이상 호출 안 함
  return undefined;
}

export type InfiniteIncorrectResult = UseInfiniteQueryResult<
  InfiniteData<IncorrectQuizPage, number>,
  Error
>;

/**
 * size 기본값을 50으로 두어,
 * 1페이지에 5개 같은 소량 데이터는 한 번에 보이도록.
 * (원하면 10으로 내려도 됩니다)
 */
export function useInfiniteIncorrectQuizzes(
  size = 10
): InfiniteIncorrectResult {
  return useInfiniteQuery<
    IncorrectQuizPage,
    Error,
    InfiniteData<IncorrectQuizPage, number>,
    QueryKey,
    number
  >({
    queryKey: ['my', 'quiz', 'incorrect', { size }],
    queryFn: ({ pageParam = 0 }) => fetchIncorrectQuizzes(pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (last, _pages, lastPageParam) =>
      getHasNext(last) ? getNextPage(last, lastPageParam) : undefined,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
