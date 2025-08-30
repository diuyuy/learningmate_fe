import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  InfiniteData,
  UseInfiniteQueryResult,
  QueryKey,
} from '@tanstack/react-query';
import ReviewCard from '@/components/ui/ReviewCard';
import { Button } from '@/components/ui/button';
import { useToggleReviewLike } from '@/features/reviews/hooks/useToggleReviewLike';
import type {
  ReviewListItem,
  ReviewListPageResponse,
} from '@/features/reviews/types/types';

const MOBILE_BREAKPOINT = 768;
const THROTTLE_DELAY = 500;

type ReviewListQuery = UseInfiniteQueryResult<
  InfiniteData<ReviewListPageResponse, number>,
  Error
>;

type ReviewListProps = {
  title?: string;
  query: ReviewListQuery;
  queryKey: QueryKey;
  extraKeys?: QueryKey[];
};

export default function ReviewList({
  title,
  query,
  queryKey,
  extraKeys = [],
}: ReviewListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = query;

  const keys = useMemo(() => [queryKey, ...extraKeys], [queryKey, extraKeys]);
  const toggleLike = useToggleReviewLike(keys);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const throttleRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  const [pendingId, setPendingId] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !throttleRef.current
        ) {
          throttleRef.current = true;
          fetchNextPage().finally(() => {
            setTimeout(() => (throttleRef.current = false), THROTTLE_DELAY);
          });
        }
      },
      { threshold: 1 }
    );

    observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [isMobile, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const pages = Array.isArray(data?.pages) ? data!.pages : [];
  const allReviews: ReviewListItem[] = useMemo(
    () => pages.flatMap((pg) => (Array.isArray(pg?.items) ? pg.items : [])),
    [pages]
  );

  const isPending = isLoading || isFetchingNextPage;

  const handleToggle = useCallback(
    (r: ReviewListItem) => {
      setPendingId(r.id);
      toggleLike.mutate(
        { reviewId: r.id, currentLiked: r.likedByMe },
        { onSettled: () => setPendingId(null) }
      );
    },
    [toggleLike]
  );

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <article className='w-full'>
      {!!title && (
        <aside className='mb-2'>
          <h1 className='text-base lg:text-2xl font-bold'>{title}</h1>
        </aside>
      )}

      <section className='flex flex-col gap-4'>
        {allReviews.length === 0 && isPending ? (
          <div>Loading...</div>
        ) : (
          allReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onToggleLike={() => handleToggle(review)}
              likeIsLoading={pendingId === review.id && toggleLike.isPending}
            />
          ))
        )}

        <div
          ref={loadMoreRef}
          className='my-3 flex justify-center items-center'
        >
          {isPending && <span className='mr-2'>Loading...</span>}

          {!isMobile && hasNextPage && (
            <Button
              className='w-30 cursor-pointer'
              onClick={() => fetchNextPage()}
              disabled={isPending}
            >
              더보기
            </Button>
          )}

          {!hasNextPage && allReviews.length > 0 && (
            <span className='text-gray-400 ml-2'>마지막 리뷰입니다.</span>
          )}
        </div>
      </section>
    </article>
  );
}
