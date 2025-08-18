import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ReviewCard from '@/components/ui/ReviewCard';
import { useReviewQuery } from '../hooks/useReviewQuery';
import type { ReviewProps } from '../types/types';

export default function ReviewListInLearning({
  articleId,
  page: initialPage = 0,
  size,
}: ReviewProps) {
  const [page, setPage] = useState(initialPage);
  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const {
    isPending,
    isError,
    data: reviews,
    error,
  } = useReviewQuery({ articleId, page, size });

  // 새 데이터가 들어오면 중복 없이 누적
  useEffect(() => {
    if (reviews) {
      if (reviews.length < size) {
        setHasMore(false); // 더 가져올 리뷰가 없음
      }

      setAllReviews((prev) => {
        const newReviews = reviews.filter(
          (r) => !prev.some((prevR) => prevR.id === r.id)
        );
        return [...prev, ...newReviews];
      });
    }
  }, [reviews, size]);

  if (isError) return <div>{error.message}</div>;

  const handleLoadMore = () => {
    if (!isPending && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <article className='w-full'>
      <aside className='mb-2'>
        <h1 className='text-base lg:text-2xl font-bold'>최신 리뷰</h1>
      </aside>

      <section className='flex flex-col gap-5'>
        {allReviews.length === 0 && isPending ? (
          <div>Loading...</div>
        ) : (
          allReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}

        {hasMore && (
          <div className='my-3 flex justify-center'>
            <Button
              className='w-30 cursor-pointer'
              onClick={handleLoadMore}
              disabled={isPending}
            >
              {isPending ? 'Loading...' : '더보기'}
            </Button>
          </div>
        )}
      </section>
    </article>
  );
}
