import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa6';
import { RiRobot2Line } from 'react-icons/ri';
import { useParams } from 'react-router';
import { useArticleQuery } from '../hooks/useArticleQuery';
import { ArticleModal } from './ArticleModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postArticleScrap, deleteArticleScrap } from '@/features/my/api/scraps';

type Props = {
  /** 모달 내에서 직접 사용할 때 articleId를 props로 전달 (라우터 없이도 동작) */
  articleId?: number;
  /** 스크랩 상태가 바뀌면 부모(목록)에 알림 */
  onScrapChange?: (articleId: number, next: boolean) => void;
};

export default function ArticleDetail({
  articleId: articleIdProp,
  onScrapChange,
}: Props) {
  const params = useParams();
  const articleId =
    articleIdProp ?? (params.articleId ? Number(params.articleId) : undefined);
  if (!articleId) return <div>ArticleID Error</div>;

  const {
    isPending,
    isError,
    data: article,
    error,
  } = useArticleQuery(articleId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const qc = useQueryClient();

  const ARTICLE_QUERY_KEY = ['article', articleId] as const;

  const toggleScrap = useMutation({
    mutationFn: async (next: boolean) =>
      next ? postArticleScrap(articleId) : deleteArticleScrap(articleId),

    onMutate: async (next) => {
      await qc.cancelQueries({ queryKey: ARTICLE_QUERY_KEY });
      const prev = qc.getQueryData(ARTICLE_QUERY_KEY);
      qc.setQueryData(ARTICLE_QUERY_KEY, (old: any) =>
        old ? { ...old, scrappedByMe: next } : old
      );
      return { prev };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(ARTICLE_QUERY_KEY, ctx.prev);
    },

    onSuccess: (_data, next) => {
      // ✅ 부모(목록)에 “해당 기사 스크랩 상태 바뀜” 알림
      onScrapChange?.(articleId, next);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ARTICLE_QUERY_KEY });
    },
  });

  if (isError) return <div>에러가 발생했습니다...{error.message}</div>;
  if (isPending || !article) return <div />;

  const scrapped = Boolean(article.scrappedByMe);

  return (
    <article className='mt-1 flex w-full flex-col gap-5'>
      <header className='mx-auto w-full px-5'>
        <div className='flex min-h-12 items-center justify-center bg-gray-300 text-lg font-extrabold md:text-xl'>
          {article.title}
        </div>
      </header>

      <section className='mt-6 flex w-full flex-wrap justify-between gap-3 px-5 md:flex-nowrap'>
        <div className='order-1 flex w-1/3 justify-start md:order-none md:w-1/5'>
          <div className='flex flex-col items-center justify-start'>
            <Avatar className='h-16 w-16 md:h-20 md:w-20'>
              <AvatarImage src='https://github.com/shadcn.png' alt='reporter' />
            </Avatar>
            <div className='mt-2 text-sm font-bold'>{article.reporter}</div>
          </div>
        </div>

        <div className='order-3 w-full md:order-none'>
          <p className='whitespace-pre-line leading-relaxed'>
            {article.content}
          </p>
        </div>

        <div className='order-2 mt-3 flex w-1/3 items-start justify-end gap-5 md:order-none md:mt-0 md:w-1/5'>
          <button
            type='button'
            className='text-2xl'
            onClick={() => setIsModalOpen(true)}
          >
            <RiRobot2Line />
          </button>

          <button
            type='button'
            aria-pressed={scrapped}
            title={scrapped ? '스크랩 취소' : '스크랩'}
            className='text-2xl'
            onClick={() => toggleScrap.mutate(!scrapped)}
            disabled={toggleScrap.isPending}
          >
            {scrapped ? (
              <FaBookmark className='text-yellow-500' />
            ) : (
              <FaRegBookmark />
            )}
          </button>
        </div>
      </section>

      <div className='w-full px-2'>
        <ArticleModal
          summary={article.summary}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </article>
  );
}
