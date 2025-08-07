import ArticleList from '@/features/articles/components/AriticleList';
import TodaysKeywordCard from '@/features/keywords/components/TodaysKeywordCard';
import ReviewListInLearning from '@/features/reviews/components/ReviewListInLearning';
import VideoPlayer from '@/features/videos/components/VideoPlayer';

export default function LearningPage() {
  return (
    <div className='max-w-full mx-auto px-8'>
      <div className='flex flex-col items-center gap-10'>
        <TodaysKeywordCard />
        <div className='flex flex-row gap-4 w-full'>
          <section className='flex flex-col gap-4 w-2/3'>
            <VideoPlayer />
            <ReviewListInLearning />
          </section>
          <aside className='w-1/3'>
            <ArticleList />
          </aside>
        </div>
      </div>
    </div>
  );
}
