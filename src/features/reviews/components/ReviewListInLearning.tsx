import { Button } from '@/components/ui/button';
import ReviewCard from '@/components/ui/ReviewCard';

export default function ReviewListInLearning() {
  return (
    <article className='w-full'>
      <aside className='mb-2'>
        <h1 className='text-base lg:text-2xl font-bold'>최신 리뷰</h1>
      </aside>
      <section className='flex flex-col gap-5'>
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />

        <div className='my-3 flex justify-center'>
          <Button className='w-30 cursor-pointer'>더보기</Button>
        </div>
      </section>
    </article>
  );
}
