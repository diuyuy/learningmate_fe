import { useArticlePreviewsQuery } from '../hooks/useArticlePreviewsQuery';
import ArticleCard from './ArticleCard';

export default function ArticleList() {
  const { isPending, isError, data, error } = useArticlePreviewsQuery(4);

  if (isPending) {
    return <div>로딩</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <article className='w-full '>
      <aside className='my-3'>
        <h1 className='lg:text-2xl font-bold'>키워드 관련 기사 목록</h1>
      </aside>
      <section className='flex flex-col gap-3'>
        {data.map((articlePreview) => {
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
