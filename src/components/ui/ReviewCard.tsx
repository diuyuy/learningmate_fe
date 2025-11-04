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
  /** 읽기 전용 모드: 하트는 채워진 아이콘으로 고정, 클릭/애니메이션 없음 */
  likeReadOnly?: boolean;
};

function ReviewCardImpl({
  review,
  onToggleLike,
  likeIsLoading,
  likeReadOnly = false,
}: Props) {
  const nickname = review.nickname || '알 수 없는 사용자';
  const dateStr = review.updatedAt ?? review.createdAt ?? '';
  const formatted = useFormattedDate(dateStr, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const liked = likeReadOnly ? true : !!review.likedByMe;
  const likeCount = review.likeCount ?? 0;

  return (
    // ✅ 카드가 화면 바깥으로 커지지 않도록 가로 오버플로 차단
    <article className='w-full max-w-full overflow-hidden'>
      <Card className='grid min-h-[120px] grid-cols-[64px_1fr] gap-3 w-full max-w-full overflow-hidden'>
        <figure className='py-4 pl-4'>
          <Avatar className='h-16 w-16'>
            <AvatarImage
              src='https://github.com/shadcn.png'
              alt={`${nickname} 프로필 이미지`}
              onError={(e) => {
                e.currentTarget.src = 'https://github.com/shadcn.png';
              }}
            />
          </Avatar>
        </figure>

        {/* ✅ 내용 영역이 줄어들 수 있도록 min-w-0 추가 */}
        <section className='pr-3 min-w-0'>
          <CardHeader className='pb-2'>
            {/* ✅ 긴 제목 줄바꿈/단어 분할 허용 */}
            <CardTitle className='text-xl font-extrabold lg:text-2xl break-words'>
              {review.id} {review.title} {nickname}
            </CardTitle>
            <CardDescription className='mb-2 text-sm lg:text-base'>
              {formatted}
            </CardDescription>
          </CardHeader>

          {/* ✅ 본문도 줄바꿈/긴 문자열 강제 분할 */}
          <CardContent className='pt-0 text-sm lg:text-base whitespace-pre-wrap break-words'>
            <p>{review.content1}</p>
          </CardContent>

          <CardFooter className='pt-2'>
            <div className='mt-4 flex w-full items-center border-t pt-3'>
              <span className='relative inline-grid h-7 w-7 place-items-center'>
                {likeReadOnly ? (
                  // ✅ 읽기 전용: 고정 하트
                  <span
                    className='grid h-7 w-7 select-none place-items-center rounded-full'
                    aria-hidden='true'
                  >
                    <FaHeart className='text-xl' color='#FF2D55' />
                  </span>
                ) : (
                  <>
                    {/* 좋아요 애니메이션 (버튼을 덮지 않도록 pointer-events-none) */}
                    <AnimatePresence initial={false}>
                      {liked && (
                        <motion.span
                          key='burst'
                          className='pointer-events-none absolute inset-0 rounded-full border-2 border-rose-400/70'
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
                      className='grid h-7 w-7 select-none place-items-center rounded-full disabled:cursor-not-allowed disabled:opacity-60'
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
                  </>
                )}
              </span>

              <span
                className='pointer-events-none ml-2 select-none text-sm'
                aria-live='polite'
              >
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
  const a = prev.review;
  const b = next.review;
  return (
    a.id === b.id &&
    a.content1 === b.content1 &&
    a.likedByMe === b.likedByMe &&
    a.likeCount === b.likeCount &&
    prev.likeIsLoading === next.likeIsLoading &&
    prev.likeReadOnly === next.likeReadOnly
  );
});
