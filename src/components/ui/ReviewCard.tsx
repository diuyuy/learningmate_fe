import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FaRegHeart } from 'react-icons/fa';

export default function ArticleReview() {
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
              Card Title
            </CardTitle>
            <CardDescription className='mb-2 text-sm lg:text-md'>
              {new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              &nbsp;&nbsp;
              {new Date().toLocaleTimeString()}
            </CardDescription>
          </CardHeader>
          <CardContent className='text-sm lg:text-md'>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Pariatur
              eos eaque illum hic quod amet perferendis minima vero! Ut ad
              tempora voluptatum atque consequuntur ullam rem deleniti, modi cum
              nisi.
            </p>
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
