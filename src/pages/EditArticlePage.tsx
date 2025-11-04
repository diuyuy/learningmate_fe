import EditArticleSection from '@/features/admin/components/EditArticleSection';
import EditQuizSection from '@/features/admin/components/EditQuizSection';
import { useParams } from 'react-router';

export default function EditArticlePage() {
  const { keywordId, articleId } = useParams();

  if (!keywordId || !articleId) {
    throw Error('Keyword 혹은 Article ID 가 필요합니다.');
  }

  return (
    <main className='mx-auto px-4 py-6 max-w-7xl'>
      <h1 className='text-3xl font-bold mb-8'>Edit Article & Quiz</h1>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <EditArticleSection keywordId={+keywordId} articleId={+articleId} />
        <EditQuizSection articleId={+articleId} />
      </div>
    </main>
  );
}
