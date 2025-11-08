import { useState } from 'react';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa6';
import { RiNewspaperLine, RiRobot2Line } from 'react-icons/ri';
import { useParams } from 'react-router';
import { useArticleQuery } from '../hooks/useArticleQuery';
import { ArticleModal } from './ArticleModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postArticleScrap, deleteArticleScrap } from '@/features/my/api/scraps';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

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
      onScrapChange?.(articleId, next);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ARTICLE_QUERY_KEY });
    },
  });

  if (isError) return <div>에러가 발생했습니다... {error.message}</div>;
  if (isPending || !article)
    return (
      <div className='animate-pulse space-y-4 px-5'>
        <div className='h-8 w-2/3 rounded bg-muted' />
        <div className='h-4 w-full rounded bg-muted' />
        <div className='h-4 w-11/12 rounded bg-muted' />
        <div className='h-4 w-4/5 rounded bg-muted' />
      </div>
    );

  const scrapped = Boolean(article.scrappedByMe);
  const publishedLabel = format(
    new Date(article.publishedAt),
    'yyyy-MM-dd (EEE)',
    { locale: ko }
  );
  return (
    <TooltipProvider delayDuration={200}>
      <article className='mx-auto mt-2 w-full max-w-5xl px-5'>
        <header className='w-full mt-4'>
          {' '}
          {/* ← 위 여백 추가 */}
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <h1 className='text-balance text-xl font-extrabold leading-tight md:text-2xl'>
              {article.title}
            </h1>

            {/* 제목 오른쪽: 키워드 뱃지 + 날짜 뱃지 */}
            <div className='flex items-center gap-2'>
              {/* 키워드 뱃지 */}
              {article.keyword?.name && (
                <span className='inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-200'>
                  <RiNewspaperLine className='h-3.5 w-3.5 text-yellow-700' />
                  <span>{article.keyword.name}</span>
                </span>
              )}

              {/* 날짜 뱃지 */}
              <span
                className='inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200'
                title={publishedLabel}
              >
                {publishedLabel}
              </span>
            </div>
          </div>
          <Separator className='mt-4' />
        </header>

        {/* 본문 + 우측 액션 레일 레이아웃 */}
        <section className='relative mt-5 grid grid-cols-1 gap-6 md:grid-cols-[1fr_56px]'>
          {/* 본문 */}
          <div>
            <div className='prose prose-neutral max-w-none whitespace-pre-line leading-relaxed dark:prose-invert'>
              {article.content}
            </div>

            {/* 모바일 액션 바 */}
            <div className='mt-6 flex items-center justify-end gap-3 md:hidden'>
              <ActionButtons
                scrapped={scrapped}
                onOpenModal={() => setIsModalOpen(true)}
                onToggleScrap={() => toggleScrap.mutate(!scrapped)}
                isLoading={toggleScrap.isPending}
              />
            </div>
          </div>

          {/* 데스크톱 우측 고정 액션 레일 */}
          <aside className='sticky top-24 hidden h-fit md:block'>
            <div
              className={cn(
                'flex w-14 flex-col items-center justify-start gap-3 rounded-2xl border bg-background p-2 shadow-sm',
                'md:w-14'
              )}
            >
              <ActionButtons
                vertical
                scrapped={scrapped}
                onOpenModal={() => setIsModalOpen(true)}
                onToggleScrap={() => toggleScrap.mutate(!scrapped)}
                isLoading={toggleScrap.isPending}
              />
            </div>
          </aside>
        </section>

        {/* 요약 모달 */}
        <ArticleModal
          summary={article.summary}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </article>
    </TooltipProvider>
  );
}

/** 아이콘 액션 묶음: 재사용 가능 & 모바일/데스크톱 공용 */
function ActionButtons({
  vertical = false,
  scrapped,
  onOpenModal,
  onToggleScrap,
  isLoading,
}: {
  vertical?: boolean;
  scrapped: boolean;
  onOpenModal: () => void;
  onToggleScrap: () => void;
  isLoading: boolean;
}) {
  return (
    <div className={cn('flex gap-3', vertical ? 'flex-col' : 'flex-row')}>
      {/* AI 요약 모달 열기 */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type='button'
            className='inline-flex h-10 w-10 items-center justify-center rounded-full border text-xl shadow-sm transition hover:bg-muted/60'
            onClick={onOpenModal}
            title='AI 요약 보기'
          >
            <RiRobot2Line />
          </button>
        </TooltipTrigger>
        <TooltipContent>AI 요약 보기</TooltipContent>
      </Tooltip>

      {/* 스크랩 토글 */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type='button'
            aria-pressed={scrapped}
            aria-label={scrapped ? '스크랩 취소' : '스크랩'}
            title={scrapped ? '스크랩 취소' : '스크랩'}
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-full border text-xl shadow-sm transition hover:bg-muted/60',
              scrapped && 'ring-1 ring-yellow-500/40'
            )}
            onClick={onToggleScrap}
            disabled={isLoading}
          >
            {scrapped ? (
              <FaBookmark className='text-yellow-500' />
            ) : (
              <FaRegBookmark />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>{scrapped ? '스크랩 취소' : '스크랩'}</TooltipContent>
      </Tooltip>
    </div>
  );
}
