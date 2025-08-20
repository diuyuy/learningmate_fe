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
import type { Review } from '@/features/reviews/types/types';
import { FaRegHeart } from 'react-icons/fa';

type Props = {
  review: Review;
};

export default function ReviewCard({ review }: Props) {
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
              {review.id} {review.user?.nickname || '알 수 없는 사용자'}
            </CardTitle>
            <CardDescription className='mb-2 text-sm lg:text-md'>
              {useFormattedDate(review.updatedAt, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className='text-sm lg:text-md'>
            <p>{review.content1}</p>
          </CardContent>
          <CardFooter>
            <div className='w-full border-t-2 mt-5 py-3 flex items-center'>
              <FaRegHeart className='text-xl' />{' '}
              <span className='ml-2 text-sm'>22</span>
            </div>
          </CardFooter>
        </section>
      </Card>
    </article>
  );
}
