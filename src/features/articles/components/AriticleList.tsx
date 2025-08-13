import ArticleCard from './ArticleCard';

export default function ArticleList() {
  return (
    <article className='w-full '>
      <aside className='mb-2'>
        <h1 className='text-2xl font-bold'>키워드 관련 기사 목록</h1>
      </aside>
      <section className='flex flex-col gap-3'>
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
        <ArticleCard />
      </section>
    </article>
  );
}
