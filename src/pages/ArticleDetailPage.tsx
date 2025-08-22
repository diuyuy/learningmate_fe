import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ArticleDetail from '@/features/articles/components/ArticleDetail';
import QuizModal from '@/features/quizzes/components/modal/QuizModal';
import ReviewForm from '@/features/reviews/components/ReviewForm';
import ReviewListInArticle from '@/features/reviews/components/ReviewListInArticle';
import { useState } from 'react';

export default function ArticleDetailPage() {

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  return (
    <div className='flex flex-col gap-4 items-center'>
      <ArticleDetail />
      <div className='flex justify-center items-center'>
        <Button variant='secondary' onClick={() => setIsQuizModalOpen(true)}>퀴즈 풀기</Button>
      </div>
      <div className='w-full lg:w-2/3 flex flex-col gap-4 items-start'>
        <Separator className='my-5' />
        <ReviewForm />
        <Separator className='my-5' />
        <ReviewListInArticle />
      </div>

      {isQuizModalOpen && (
          <QuizModal
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
          />
      )}
    </div>
  );
}
