// src/features/my/components/MyReview.tsx
import { useState, useMemo, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query'; // ✅ 추가
import { SlidersHorizontal, Check } from 'lucide-react';
import ReviewCard from '@/components/ui/ReviewCard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ReviewListItem } from '@/features/reviews/types/types';
import {
  useInfiniteMyReviews,
  type MyReviewSort,
} from '@/features/my/hooks/useInfiniteMyReviews';
import { QUERY_KEYS } from '@/constants/querykeys';

const PAGE_SIZE = 10;
const MOBILE_BREAKPOINT = 768;
const THROTTLE_DELAY = 500;

export default function MyReview() {
  const qc = useQueryClient(); // ✅

  // 정렬은 UI 전용(요청 영향 X)
  const [sortUI, setSortUI] = useState<MyReviewSort>('latest');

  // ✅ 진입 시 1회 무효화 → 곧바로 최신화 트리거
  useEffect(() => {
    qc.invalidateQueries({
      queryKey: [QUERY_KEYS.REVIEWS, 'me'],
    });
    // 완전 초기화가 필요하면 invalidate 대신 아래를 사용:
    // qc.removeQueries({ queryKey: [QUERY_KEYS.REVIEWS, 'me'] });
  }, [qc]);

  // API는 고정 파라미터로 호출
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteMyReviews('latest', PAGE_SIZE);

  const pages = Array.isArray(data?.pages) ? data.pages : [];
  const items: ReviewListItem[] = useMemo(
    () => pages.flatMap((pg) => pg.items || []),
    [pages]
  );

  const [isMobile, setIsMobile] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const throttleRef = useRef(false);

  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    handle();
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);

  useEffect(() => {
    if (!isMobile || !loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0]?.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !throttleRef.current
        ) {
          throttleRef.current = true;
          fetchNextPage().finally(() => {
            setTimeout(() => {
              throttleRef.current = false;
            }, THROTTLE_DELAY);
          });
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [isMobile, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isError) {
    return (
      <div
        role='alert'
        className='rounded-xl border border-red-200 bg-red-50 p-3 text-red-600'
      >
        {error?.message ?? '내 리뷰를 불러오지 못했어요.'}
      </div>
    );
  }

  const isPending = isLoading || isFetchingNextPage;

  return (
    <article className='w-full'>
      <header className='mb-3 flex items-center justify-end border-b pb-2'>
        {/* 정렬 드롭다운(UI만, 요청 영향 없음) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              aria-label='정렬 선택'
              title='정렬 선택'
            >
              <SlidersHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-36'>
            <DropdownMenuRadioGroup
              value={sortUI}
              onValueChange={(v) => setSortUI(v as MyReviewSort)}
            >
              <DropdownMenuRadioItem
                value='latest'
                className='flex items-center justify-between'
              >
                최신순 {sortUI === 'latest' && <Check className='h-4 w-4' />}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value='liked'
                className='flex items-center justify-between'
              >
                공감순 {sortUI === 'liked' && <Check className='h-4 w-4' />}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <section className='flex flex-col gap-4'>
        {items.length === 0 && isPending ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div className='text-sm text-zinc-500'>작성한 리뷰가 없습니다.</div>
        ) : (
          items.map((review) => (
            <ReviewCard key={review.id} review={review} likeReadOnly />
          ))
        )}

        <div
          ref={loadMoreRef}
          className='my-3 flex items-center justify-center'
        >
          {isPending && <span className='mr-2'>Loading...</span>}

          {!isMobile && hasNextPage && (
            <Button
              className='w-32 cursor-pointer'
              onClick={() => fetchNextPage()}
              disabled={isPending}
            >
              더보기
            </Button>
          )}

          {!hasNextPage && items.length >= PAGE_SIZE && (
            <span className='ml-2 text-gray-400'>마지막 리뷰입니다.</span>
          )}
        </div>
      </section>
    </article>
  );
}
