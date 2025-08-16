import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ArticlePreview } from '../types/types';

type Props = {
  articlePreview: ArticlePreview;
};

export default function ArticleCard({ articlePreview }: Props) {
  return (
    <article className='w-full'>
      <Card className='flex flex-row min-h-10'>
        <figure className='w-1/10'>
          <Avatar className='w-15 h-15 ml-5 rounded-lg'>
            <AvatarImage src='https://github.com/shadcn.png' />
          </Avatar>
        </figure>
        <section className='w-9/10 ml-3'>
          <CardHeader>
            <CardTitle className='text-base sm:text-2xl'>
              <h1>{articlePreview.title}</h1>
            </CardTitle>
            <CardDescription className='flex justify-between'>
              <h4>{articlePreview.press}</h4>
              <h4>{articlePreview.publishedAt}</h4>
            </CardDescription>
          </CardHeader>
        </section>
      </Card>
    </article>
  );
}
