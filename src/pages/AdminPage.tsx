import ArticleSection from '@/features/admin/components/ArticleSection';
import KeywordSection from '@/features/admin/components/KeywordSection';
import VideoSection from '@/features/admin/components/VideoSecion';
import type { KeywordWithVideo } from '@/features/keywords/types/types';
import { useState } from 'react';

export default function AdminPage() {
  const [keyword, setKeyword] = useState<KeywordWithVideo | undefined>();

  return (
    <main className='flex flex-col gap-20 mx-4  max-w-7xl lg:mx-auto '>
      <h1 className='text-3xl font-bold'>Admin Page</h1>
      <KeywordSection onKeywordSelect={setKeyword} />

      {keyword && <VideoSection keywordId={keyword.id} video={keyword.video} />}
      {keyword && <ArticleSection keywordId={keyword.id} />}
    </main>
  );
}
