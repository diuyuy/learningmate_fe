// components/ui/ReviewCard.tsx  (혹은 실제 경로에 맞게)
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

type Props = {
  review: ReviewListItem; // ✅ 리스트 전용 타입 사용
};

export default function ReviewCard({ review }: Props) {
  const formattedDate = useFormattedDate(
    // 백엔드 DTO에서 createdAt 사용 (없으면 안전하게 빈 문자열)
    (review as any).updatedAt ?? review.createdAt ?? '',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }
  );

  return (
    <article className='w-full'>
      <Card className='flex flex-row min-h-30'>
        <figure className='w-1/10'>
          <Avatar className='w-15 h-15 ml-5'>
            <AvatarImage src='https://github.com/shadcn.png' />
          </Avatar>
        </figure>

        <section className='w-9/10 ml-2'>
          <CardHeader>
            <CardTitle className='text-xl lg:text-2xl font-extrabold'>
              {review.id} {review.nickname || '알 수 없는 사용자'}
            </CardTitle>
            <CardDescription className='mb-2 text-sm lg:text-md'>
              {formattedDate}
            </CardDescription>
          </CardHeader>

          <CardContent className='text-sm lg:text-md'>
            <p>{review.content1}</p>
          </CardContent>

          <CardFooter>
            <div className='w-full border-t-2 mt-5 py-3 flex items-center'>
              {/* 표시만: likedByMe에 따라 아이콘 변경 */}
              {review.likedByMe ? (
                <FaHeart className='text-xl' aria-hidden />
              ) : (
                <FaRegHeart className='text-xl' aria-hidden />
              )}
              <span className='ml-2 text-sm'>{review.likeCount}</span>
            </div>
          </CardFooter>
        </section>
      </Card>
    </article>
  );
}
