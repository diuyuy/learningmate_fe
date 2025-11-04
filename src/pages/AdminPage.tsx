import ArticleSection from '@/features/admin/components/ArticleSection';
import KeywordSection from '@/features/admin/components/KeywordSection';
import VideoSection from '@/features/admin/components/VideoSecion';
import { useKeywordTableStore } from '@/features/admin/store/keywordTableStore';

export default function AdminPage() {
  const keyword = useKeywordTableStore((state) => state.keyword);

  return (
    <main className='flex flex-col gap-20 mx-4  max-w-7xl lg:mx-auto '>
      <h1 className='text-3xl font-bold'>Admin Page</h1>
      <KeywordSection />

      {keyword && <VideoSection keywordId={keyword.id} video={keyword.video} />}
      {keyword && <ArticleSection keywordId={keyword.id} />}
    </main>
  );
}
