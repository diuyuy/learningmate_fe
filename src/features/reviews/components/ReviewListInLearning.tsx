import { Button } from '@/components/ui/button';
import ArticleReview from '@/features/articles/components/ArticleReview';

export default function ReviewListInLearning() {
  return (
    <article className='w-full'>
      <aside className='mt-5 mb-2'>
        <h1 className='text-base lg:text-2xl font-extrabold'>최신 리뷰</h1>
      </aside>
      <section className='flex flex-col gap-5'>
        <ArticleReview />
        <ArticleReview />
        <ArticleReview />
        <ArticleReview />
        <div className='my-3 flex justify-center'>
          <Button className='w-30 cursor-pointer'>더보기</Button>
        </div>
      </section>
    </article>
  );
}
