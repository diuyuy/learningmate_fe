import { Card } from '@/components/ui/card';
import type { ReviewListItem } from '@/features/reviews/types/types';
import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Link } from 'react-router';

type Props = {
  review: ReviewListItem;
  onToggleLike?: () => void;
  likeIsLoading?: boolean;
};

function HotReviewCardImpl({ review, onToggleLike, likeIsLoading }: Props) {
  const liked = review.likedByMe;
  const likeCount = review.likeCount ?? 0;

  const dateStr = (review as any).updatedAt ?? review.createdAt ?? '';
  const formattedDate = dateStr
    ? format(new Date(dateStr), 'yyyy.MM.dd HH:mm', { locale: ko })
    : '';

  return (
    <article className='w-full'>
      <Card className='relative overflow-hidden rounded-xl border shadow-sm p-0'>
        <div className='flex items-stretch'>
          <Link
            to={`/article/${review.articleId}`}
            className='w-11 shrink-0 bg-amber-100 text-amber-900 flex items-center justify-center rounded-l-md cursor-pointer'
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'upright' as any,
            }}
          >
            <div
              className='w-11 shrink-0 bg-amber-100 text-amber-900 flex items-center justify-center rounded-l-md cursor-pointer'
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'upright' as any,
              }}
              aria-hidden
            >
              <span className='text-[11px] font-semibold tracking-tight'>
                기사보기
              </span>
            </div>
          </Link>

          <div className='flex-1 min-w-0 p-3'>
            <div className='flex items-center justify-between gap-3'>
              <h3 className='font-semibold text-foreground text-base md:text-lg'>
                {review.title}
              </h3>

              <div className='flex items-center'>
                <span className='relative inline-grid place-items-center h-7 w-7'>
                  <AnimatePresence initial={false}>
                    {liked && (
                      <motion.span
                        key='burst'
                        className='absolute inset-0 rounded-full border-2 border-rose-400/70'
                        initial={{ scale: 0, opacity: 0.7 }}
                        animate={{ scale: 1.8, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                      />
                    )}
                  </AnimatePresence>

                  <motion.button
                    type='button'
                    onClick={onToggleLike}
                    disabled={likeIsLoading}
                    aria-pressed={liked}
                    aria-label={liked ? '좋아요 취소' : '좋아요'}
                    className='grid place-items-center h-7 w-7 rounded-full select-none disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer'
                    initial={false}
                    whileTap={{ scale: 0.9 }}
                  >
                    {liked ? (
                      <FaHeart
                        className='text-xl drop-shadow-sm'
                        color='#FF2D55'
                      />
                    ) : (
                      <FaRegHeart className='text-xl text-muted-foreground' />
                    )}
                  </motion.button>
                </span>

                <span className='ml-2 text-sm select-none pointer-events-none'>
                  {likeCount}
                </span>
              </div>
            </div>

            {formattedDate && (
              <p className='mt-1 text-xs text-muted-foreground'>
                {formattedDate}
              </p>
            )}

            <p className='mt-2 text-sm text-muted-foreground whitespace-normal'>
              {review.content1}
            </p>
          </div>
        </div>
      </Card>
    </article>
  );
}

export default memo(HotReviewCardImpl, (prev, next) => {
  const a = prev.review,
    b = next.review;
  return (
    a.id === b.id &&
    a.content1 === b.content1 &&
    a.likedByMe === b.likedByMe &&
    a.likeCount === b.likeCount &&
    prev.likeIsLoading === next.likeIsLoading
  );
});
