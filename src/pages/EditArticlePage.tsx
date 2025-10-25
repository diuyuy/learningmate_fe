import EditArticleSection from '@/features/admin/components/EditArticleSection';
import EditQuizSection from '@/features/admin/components/EditQuizSection';
import { useParams } from 'react-router';

export default function EditArticlePage() {
  const { keywordId, articleId } = useParams();

  if (!keywordId || !articleId) {
    throw Error('Keyword 혹은 Article ID 가 필요합니다.');
  }

  return (
    <main className='mx-4 md:mx-auto md:w-[85%] flex flex-col gap-8'>
      <h1 className='text-3xl font-bold'>Edit Article & Quiz</h1>
      <div className='flex-wrap md:flex-nowrap md:flex md:justify-between gap-8'>
        <EditArticleSection keywordId={+keywordId} articleId={+articleId} />
        <EditQuizSection articleId={+articleId} />
      </div>
    </main>
  );
}
