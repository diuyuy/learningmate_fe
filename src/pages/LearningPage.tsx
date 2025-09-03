import { Skeleton } from '@/components/ui/skeleton';
import ArticleList from '@/features/articles/components/AriticleList';
import TodaysKeywordCard from '@/features/keywords/components/TodaysKeywordCard';
import { useTodaysKeywordQuery } from '@/features/keywords/hooks/useTodaysKeywordQuery';
import ReviewListInLearning from '@/features/reviews/components/ReviewListInLearning';
import VideoPlayer from '@/features/videos/components/VideoPlayer';

export default function LearningPage() {
  const {
    isPending,
    isError,
    data: todaysKeyword,
    error,
  } = useTodaysKeywordQuery();

  if (isError) {
    //TODO: 에러 페이지 구성 필요
    return <div>에러가 발생했습니다.{error.message}</div>;
  }

  return (
    <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='flex flex-col items-center gap-10'>
        {isPending ? (
          <div className='w-[90vw] sm:w-full max-w-3xl mx-auto my-5 border-2 px-4 sm:px-6 lg:px-8'>
            <Skeleton className='w-full aspect-video' />
          </div>
        ) : (
          <TodaysKeywordCard
            keywordName={todaysKeyword.keyword.name}
            keywordDesc={todaysKeyword.keyword.description}
          />
        )}
        <article className='flex flex-col lg:flex-row gap-10 lg:gap-20 w-full'>
          <section className='flex flex-col gap-4 w-full lg:w-1/2'>
            {isPending ? (
              <Skeleton className='flex flex-col gap-4 w-full lg:w-1/2' />
            ) : (
              <VideoPlayer
                todaysKeywordId={todaysKeyword.keyword.id}
                videoId='vbjLJnlB2kg'
              />
            )}

            {isPending ? (
              <Skeleton className='w-full' />
            ) : (
              <ArticleList keywordId={todaysKeyword.keyword.id} />
            )}
          </section>
          <aside className='w-full lg:w-1/2'>
            {isPending ? (
              <Skeleton className='w-full' />
            ) : (
              <ReviewListInLearning keywordId={todaysKeyword.keyword.id} />
            )}
          </aside>
        </article>
      </div>
    </div>
  );
}
