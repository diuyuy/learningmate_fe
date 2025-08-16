import ArticleList from '@/features/articles/components/AriticleList';
import TodaysKeywordCard from '@/features/keywords/components/TodaysKeywordCard';
import ReviewListInLearning from '@/features/reviews/components/ReviewListInLearning';
import VideoPlayer from '@/features/videos/components/VideoPlayer';

export default function LearningPage() {
  return (
    <div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='flex flex-col items-center gap-10'>
        <TodaysKeywordCard />
        <article className='flex flex-col lg:flex-row gap-10 lg:gap-20 w-full'>
          <section className='flex flex-col gap-4 w-full lg:w-1/2'>
            <VideoPlayer />
            <ArticleList />
          </section>
          <aside className='w-full lg:w-1/2'>
            <ReviewListInLearning />
          </aside>
        </article>
      </div>
    </div>
  );
}
