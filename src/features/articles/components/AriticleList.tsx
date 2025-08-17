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
        {articlePreivews.map((articlePreview) => {
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
