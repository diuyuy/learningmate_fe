import { useEffect, useMemo, useRef } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import IncorrectQuizAccordionItem from '@/features/my/components/IncorrectQuizItem';
import { useInfiniteIncorrectQuizzes } from '@/features/my/hooks/useInfiniteIncorrectQuizzes';
import type { IncorrectQuizItem } from '@/features/my/types/quiz';

const PAGE_SIZE = 50; // 훅과 통일
const THROTTLE_MS = 400;

export default function IncorrectQuizList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteIncorrectQuizzes(PAGE_SIZE);

  const pages = data?.pages ?? [];

  // ✅ 중복제거 제거: 서버가 같은 id를 주더라도 각 항목은 별도 시도로 취급
  const items = useMemo<IncorrectQuizItem[]>(() => {
    const flat = [];
    for (const p of pages) {
      for (const it of p.items ?? []) {
        flat.push(it);
      }
    }
    return flat;
  }, [pages]);

  const totalCount = items.length;

  // 무한스크롤 sentinel & throttle
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const throttleRef = useRef(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const onIntersect: IntersectionObserverCallback = (entries) => {
      const first = entries[0];
      if (
        first?.isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage &&
        !throttleRef.current
      ) {
        throttleRef.current = true;
        fetchNextPage().finally(() => {
          setTimeout(() => {
            throttleRef.current = false;
          }, THROTTLE_MS);
        });
      }
    };

    const io = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: '0px 0px 600px 0px',
      threshold: 0.01,
    });

    io.observe(el);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 콘텐츠가 적어 sentinel이 바로 보이는 경우 1회 선요청
  useEffect(() => {
    if (
      !isLoading &&
      items.length < PAGE_SIZE &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [isLoading, items.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div
        role='alert'
        className='rounded-xl border border-red-200 bg-red-50 p-3 text-red-600'
      >
        {error.message}
      </div>
    );
  }

  return (
    <div className='rounded-2xl border p-4 shadow-sm'>
      <div className='mb-3 flex items-center gap-2'>
        <h3 className='text-lg font-semibold'>틀린 문제</h3>
        <span className='rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600'>
          {totalCount}건
        </span>
      </div>

      {isLoading && (
        <div className='h-20 animate-pulse rounded-xl bg-zinc-100' />
      )}

      {/* 0건 Empty State */}
      {!isLoading && totalCount === 0 && (
        <div className='py-10 text-center text-sm text-zinc-500'>
          표시할 데이터가 없습니다.
        </div>
      )}

      {totalCount > 0 && (
        <>
          {/* multiple 확장 허용 */}
          <Accordion.Root type='multiple' className='space-y-2'>
            {items.map((it, idx) => {
              // ✅ 복합키: id + answerCreatedAt (없으면 idx 보조)
              const uniq = `${it.id}-${it.answerCreatedAt ?? idx}`;
              return (
                <IncorrectQuizAccordionItem key={uniq} value={uniq} item={it} />
              );
            })}
          </Accordion.Root>

          {/* sentinel */}
          <div ref={sentinelRef} className='h-8 w-full' />

          {/* 상태 텍스트 / Fallback 버튼 */}
          <div className='mt-3 flex items-center justify-center gap-8 text-sm text-zinc-500'>
            {isFetchingNextPage && <span>Loading...</span>}
            {hasNextPage && items.length > 0 && (
              <button
                className='rounded-md border px-3 py-1.5 text-sm shadow-sm hover:bg-zinc-50'
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                더보기
              </button>
            )}
            {!hasNextPage && items.length > 0 && <span>마지막입니다.</span>}
          </div>
        </>
      )}
    </div>
  );
}
