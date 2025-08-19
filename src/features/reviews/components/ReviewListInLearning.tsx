import { useEffect, useRef, useState } from 'react';
import { useInfiniteReviews } from '../hooks/useInfiniteReviewsQuery';
import ReviewCard from '@/components/ui/ReviewCard';
import { Button } from '@/components/ui/button';
import type { Review, ReviewProps } from '../types/types';

const MOBILE_BREAKPOINT = 768; // px 기준
const THROTTLE_DELAY = 500; // ms

export default function ReviewListFinal({ keywordId }: ReviewProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteReviews(keywordId);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const throttleRef = useRef(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // 화면 크기에 따라 모바일/PC 여부 판단
  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 모바일이면 IntersectionObserver로 자동 무한스크롤 (throttle 적용)
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
            setTimeout(() => {
              throttleRef.current = false;
            }, THROTTLE_DELAY);
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

  const allReviews: Review[] = data?.pages.flat() || [];
  const isPending = isLoading || isFetchingNextPage;

  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <article className='w-full'>
      <aside className='mb-2'>
        <h1 className='text-base lg:text-2xl font-bold'>최신 리뷰</h1>
      </aside>

      <section className='flex flex-col gap-5'>
        {allReviews.length === 0 && isPending ? (
          <div>Loading...</div>
        ) : (
          data?.pages.map((page, pageIndex) =>
            page.map((review) => (
              <ReviewCard key={`${pageIndex}-${review.id}`} review={review} />
            ))
          )
        )}

        {/* 마지막 sentinel / 로딩 & 버튼 영역 */}
        <div
          ref={loadMoreRef}
          className='my-3 flex justify-center items-center'
        >
          {isPending && <span className='mr-2'>Loading...</span>}

          {/* PC: 버튼 클릭으로 다음 페이지 로드 */}
          {!isMobile && hasNextPage && (
            <Button
              className='w-30 cursor-pointer'
              onClick={() => fetchNextPage()}
              disabled={isPending}
            >
              더보기
            </Button>
          )}

          {/* 마지막 페이지 표시 */}
          {!hasNextPage && allReviews.length > 0 && (
            <span className='text-gray-400 ml-2'>마지막 리뷰입니다.</span>
          )}
        </div>
      </section>
    </article>
  );
}
