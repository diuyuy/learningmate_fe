import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FaFire } from 'react-icons/fa';
import { useHotReviews } from '@/features/reviews/hooks/useHotReviews';
import { useToggleReviewLike } from '@/features/reviews/hooks/useToggleReviewLike';
import type { ReviewListItem } from '@/features/reviews/types/types';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import HotReviewCard from '@/components/ui/HotReviewCard';

type Props = {
  date: Date;
};

export default function HotReviewList({ date }: Props) {
  const dateISO = format(date, 'yyyy-MM-dd');

  const { data, isPending, isError, isFetching, refetch } =
    useHotReviews(dateISO);

  const cacheKeys = useMemo(
    () => [['hot-reviews', dateISO] as const],
    [dateISO]
  );
  const toggleLike = useToggleReviewLike(cacheKeys);
  const [pendingId, setPendingId] = useState<number | null>(null);

  const items = useMemo(() => data ?? [], [data]);

  const handleToggleLike = useCallback(
    (review: ReviewListItem) => {
      setPendingId(review.id);
      toggleLike.mutate(
        { reviewId: review.id, currentLiked: review.likedByMe },
        { onSettled: () => setPendingId(null) }
      );
    },
    [toggleLike]
  );

  const MIN_VISIBLE = 220;
  const APPEAR_DELAY = 120;
  const [showFetchIndicator, setShowFetchIndicator] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isFetching && !isPending) {
      const t = window.setTimeout(
        () => setShowFetchIndicator(true),
        APPEAR_DELAY
      );
      timerRef.current = t as unknown as number;
    } else {
      if (showFetchIndicator) {
        const t = window.setTimeout(
          () => setShowFetchIndicator(false),
          MIN_VISIBLE
        );
        timerRef.current = t as unknown as number;
      } else {
        setShowFetchIndicator(false);
      }
    }
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [isFetching, isPending, showFetchIndicator]);

  return (
    <section className='w-full'>
      <header className='mb-3 flex items-center gap-2'>
        <FaFire className='h-7 w-7 text-orange-500 drop-shadow-sm' />
        <h2 className='text-lg font-semibold'>
          Hot 리뷰{' '}
          <span className='text-sm text-muted-foreground'>
            {format(date, 'PPP (EEE)', { locale: ko })}
          </span>
        </h2>
      </header>

      {isPending && (
        <div className='space-y-3'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className='p-3'>
              <div className='flex items-start gap-3'>
                <Skeleton className='h-14 w-11 rounded-md' />
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-3 w-full' />
                  <Skeleton className='h-3 w-5/6' />
                </div>
                <Skeleton className='h-4 w-12' />
              </div>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <div className='rounded-xl border p-4 text-sm'>
          데이터를 불러오지 못했어요.{' '}
          <button
            className='underline underline-offset-2'
            onClick={() => refetch()}
          >
            다시 시도
          </button>
        </div>
      )}

      {!isPending &&
        !isError &&
        (items.length === 0 ? (
          <div className='rounded-xl border p-6 text-center text-sm text-muted-foreground'>
            이 날짜의 Hot 리뷰가 없어요.
          </div>
        ) : (
          <div className='relative'>
            <ul className='space-y-3'>
              {items.map((review) => (
                <li key={review.id}>
                  <HotReviewCard
                    review={review}
                    onToggleLike={() => handleToggleLike(review)}
                    likeIsLoading={
                      pendingId === review.id && toggleLike.isPending
                    }
                  />
                </li>
              ))}
            </ul>

            {showFetchIndicator && (
              <div
                aria-hidden
                className='pointer-events-none absolute inset-0 rounded-xl bg-white/40 backdrop-blur-[1px] animate-pulse'
              />
            )}
          </div>
        ))}
    </section>
  );
}
