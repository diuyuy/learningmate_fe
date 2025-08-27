// components/ui/ReviewCard.tsx
import { memo } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useFormattedDate } from '@/features/reviews/hooks/useFormattedDate';
import type { ReviewListItem } from '@/features/reviews/types/types';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  review: ReviewListItem;
  onToggleLike?: () => void;
  likeIsLoading?: boolean;
};

function ReviewCardImpl({ review, onToggleLike, likeIsLoading }: Props) {
  const nickname = review.nickname || '알 수 없는 사용자';
  const dateStr = (review as any).updatedAt ?? review.createdAt ?? '';

  const formatted = useFormattedDate(dateStr, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const liked = review.likedByMe;
  const likeCount = review.likeCount ?? 0;

  return (
    <article className='w-full'>
      <Card className='flex flex-row min-h-30'>
        <figure className='w-1/10'>
          <Avatar className='w-15 h-15 ml-5'>
            <AvatarImage
              src={
                typeof (review as any)?.image_url === 'string' &&
                (review as any).image_url.trim() !== ''
                  ? (review as any).image_url
                  : 'https://github.com/shadcn.png'
              }
              onError={(e) => {
                e.currentTarget.src = 'https://github.com/shadcn.png';
              }}
            />
          </Avatar>
        </figure>

        <section className='w-9/10 ml-2'>
          <CardHeader>
            <CardTitle className='text-xl lg:text-2xl font-extrabold'>
              {review.id} {nickname}
            </CardTitle>
            <CardDescription className='mb-2 text-sm lg:text-md'>
              {formatted}
            </CardDescription>
          </CardHeader>

          <CardContent className='text-sm lg:text-md'>
            <p>{review.content1}</p>
          </CardContent>

          <CardFooter>
            <div className='w-full border-t-2 mt-5 py-3 flex items-center'>
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
                  className='grid place-items-center h-7 w-7 rounded-full select-none disabled:opacity-60 disabled:cursor-not-allowed'
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
          </CardFooter>
        </section>
      </Card>
    </article>
  );
}

export default memo(ReviewCardImpl, (prev, next) => {
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
