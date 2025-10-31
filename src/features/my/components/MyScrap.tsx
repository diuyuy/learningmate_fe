import { useEffect, useMemo, useRef } from 'react';
import { useInfiniteMyScraps } from '@/features/my/hooks/useInfiniteMyScraps';
import ScrapCard from '@/features/my/components/ScrapCard';
import { deleteArticleScrap, postArticleScrap } from '@/features/my/api/scraps';
import type { ScrapItem } from '@/features/my/types/scraps';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const GRID_COLS = 'md:grid-cols-2'; // 필요시 md:grid-cols-3 로 변경

export default function MyScrap() {
  const size = 12;
  const queryKey = ['my', 'scraps', { size }] as const;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteMyScraps(size);

  const pages = data?.pages ?? [];
  const items: ScrapItem[] = useMemo(
    () => pages.flatMap((p) => p.items ?? []),
    [pages]
  );

  // --- 스크랩 토글(낙관적 업데이트)
  const qc = useQueryClient();
  const toggleMutation = useMutation({
    mutationFn: async ({ id, next }: { id: number; next: boolean }) => {
      return next ? postArticleScrap(id) : deleteArticleScrap(id);
    },
    onMutate: async ({ id, next }) => {
      await qc.cancelQueries({ queryKey });
      const prev = qc.getQueryData<any>(queryKey);

      const patched = prev && {
        ...prev,
        pages: prev.pages.map((pg: any) => ({
          ...pg,
          items: (pg.items ?? []).map((it: ScrapItem) =>
            it.id === id ? { ...it, scrappedByMe: next } : it
          ),
        })),
      };

      qc.setQueryData(queryKey, patched);
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKey, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey });
    },
  });

  const onToggleScrap = (id: number, next: boolean) =>
    toggleMutation.mutate({ id, next });

  // --- 무한 스크롤
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const throttleRef = useRef(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
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
            }, 400);
          });
        }
      },
      { root: null, rootMargin: '0px 0px 600px 0px', threshold: 0.01 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
    <section className='space-y-4'>
      {isLoading && (
        <div className='h-24 animate-pulse rounded-xl bg-zinc-100' />
      )}

      {!isLoading && items.length === 0 && (
        <div className='py-16 text-center text-sm text-zinc-500'>
          스크랩한 기사가 없습니다.
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className={`grid gap-4 ${GRID_COLS}`}>
            {items.map((it) => (
              <ScrapCard
                key={`${it.id}-${it.publishedAt ?? ''}`}
                item={it}
                onToggleScrap={onToggleScrap}
              />
            ))}
          </div>

          {/* sentinel */}
          <div ref={sentinelRef} className='h-8 w-full' />

          {/* 상태/더보기 Fallback */}
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
    </section>
  );
}
