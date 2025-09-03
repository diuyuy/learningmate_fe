import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useArticlePreviewsQuery } from '../hooks/useArticlePreviewsQuery';
import ArticleCard from './ArticleCard';

type Props = {
  keywordId: number;
};

export default function ArticleList({ keywordId }: Props) {
  const {
    isPending,
    isError,
    data: articlePreivews,
    error,
  } = useArticlePreviewsQuery(keywordId);

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <article className='w-full '>
      <aside className='my-3'>
        <h1 className='lg:text-2xl font-bold'>키워드 관련 기사 목록</h1>
      </aside>
      <section className='flex flex-col gap-3'>
        {isPending
          ? Array.from({ length: 7 }).map((_, idx) => (
              <article key={idx} className='w-full'>
                <Card className='flex flex-row justify-between min-h-10'>
                  <figure className='w-1/10'>
                    <div className='flex flex-col justify-center items-start gap-2 ml-5'>
                      <Skeleton className='w-15 h-15 rounded-lg' />
                      <Skeleton className='w-15 h-3' />
                    </div>
                  </figure>
                  <section className='w-9/10 ml-3'>
                    <div className='px-6 mb-3'>
                      <Skeleton className='w-full h-4' />
                    </div>
                    <div className='px-6 mb-3'>
                      <Skeleton className='w-28 h-3' />
                    </div>
                    <div className='px-6 space-y-2'>
                      <Skeleton className='w-full h-[14px]' />
                      <Skeleton className='w-full h-[14px]' />
                    </div>
                  </section>
                </Card>
              </article>
            ))
          : articlePreivews.map((articlePreview) => {
              return (
                <ArticleCard
                  key={articlePreview.id}
                  articlePreview={articlePreview}
                />
              );
            })}
      </section>
    </article>
  );
}
