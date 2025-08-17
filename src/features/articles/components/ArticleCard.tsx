import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useFormattedDate } from '@/features/reviews/hooks/useFormattedDate';
import type { ArticlePreview } from '../types/types';

type Props = {
  articlePreview: ArticlePreview;
};

export default function ArticleCard({ articlePreview }: Props) {
  const date = useFormattedDate(articlePreview.publishedAt, {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <article className='w-full'>
      <Card className='flex flex-row justify-between min-h-10'>
        <figure className='w-1/10'>
          <div className='flex flex-col justify-center items-start gap-2 ml-5'>
            <Avatar className='w-15 h-15 rounded-lg'>
              <AvatarImage src='https://github.com/shadcn.png' />
            </Avatar>
            <small className='text-xs w-15'>{articlePreview.press}</small>
          </div>
        </figure>
        <section className='w-9/10 ml-3'>
          <CardHeader>
            <CardTitle className='text-base'>
              <h1>{articlePreview.title}</h1>
            </CardTitle>
          </CardHeader>
          <CardDescription className='flex justify-between px-6 mb-2'>
            <small>{date}</small>
          </CardDescription>
          <CardContent className='px-6 text-sm'>
            <p className='line-clamp-2'>{articlePreview.content}</p>
          </CardContent>
        </section>
      </Card>
    </article>
  );
}
