import { Button } from '@/components/ui/button';
import ArticleDetail from '@/features/articles/components/ArticleDetail';
import ReviewForm from '@/features/reviews/components/ReviewForm';
import ReviewListInArticle from '@/features/reviews/components/ReviewListInArticle';

export default function ArticleDetailPage() {
  return (
    <div className='flex flex-col gap-4 items-center'>
      <ArticleDetail />
      <div className='w-3/5 flex flex-col gap-4 items-start'>
        <Button variant='secondary'>퀴즈 풀기</Button>
        <ReviewForm />
        <ReviewListInArticle />
      </div>
    </div>
  );
}
