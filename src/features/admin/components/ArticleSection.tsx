import { Button } from '@/components/ui/button';
import { useArticlePreviewsQuery } from '@/features/articles/hooks/useArticlePreviewsQuery';
import { PlusIcon } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import ArticleItem from './ArticleItem';

type Props = {
  keywordId: number;
};

export default function ArticleSection({ keywordId }: Props) {
  const { isPending, isError, data } = useArticlePreviewsQuery(keywordId);

  return (
    <section>
      <div className='flex justify-between mb-8'>
        <h2 className='text-2xl font-bold'>Articles</h2>
        <Button variant={'secondary'} className='font-semibold'>
          <PlusIcon /> Add new Article
        </Button>
      </div>
      {isPending ? (
        <div className='w-full flex justify-center'>
          <ClipLoader color='grey' />
        </div>
      ) : isError ? (
        <div className='text-center'>예상치 못한 에러가 발생했습니다.</div>
      ) : (
        <>
          {data.length === 0 ? (
            <p className='text-center'>등록된 Article이 없습니다.</p>
          ) : (
            <ul className='space-y-3'>
              {data.map((article) => (
                <li key={article.id}>
                  <ArticleItem
                    keywordId={keywordId}
                    articleId={article.id}
                    title={article.title}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
