import * as Dialog from '@radix-ui/react-dialog';
import { Bookmark, BookmarkCheck, CalendarDays, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useMemo, useState } from 'react';
import type { ScrapItem } from '@/features/my/types/scraps';
import { Button } from '@/components/ui/button';
import ArticleDetail from '@/features/articles/components/ArticleDetail';

type Props = {
  item: ScrapItem;
  onToggleScrap: (id: number, next: boolean) => void; // 이미 MyScrap에서 낙관적 패치 + invalidate 처리
};

export default function ScrapCard({ item, onToggleScrap }: Props) {
  const [open, setOpen] = useState(false);

  const dateLabel = useMemo(() => {
    const raw = (item as any).publishedAt ?? item.date;
    if (!raw) return '';
    return format(new Date(raw), 'yyyy.MM.dd.', { locale: ko });
  }, [item]);

  const scrapped = Boolean(item.scrappedByMe);

  return (
    <article className='rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md'>
      {/* 제목 */}
      <h2 className='line-clamp-2 text-lg font-bold leading-snug'>
        {item.title}
      </h2>

      {/* 날짜 + 조회수 */}
      <div className='mt-1 flex items-center gap-4 text-sm text-zinc-600'>
        {dateLabel && (
          <span className='inline-flex items-center gap-1.5 leading-none'>
            <CalendarDays className='h-4 w-4 text-zinc-500 translate-y-[1px]' />
            {dateLabel}
          </span>
        )}

        <span className='inline-flex items-center gap-1.5 leading-none'>
          <Eye className='h-4 w-4 text-zinc-500 translate-y-[1px]' />
          {item.views ?? 0}
        </span>

        <span className='inline-flex items-center gap-1.5 leading-none'>
          <Bookmark className='h-4 w-4 text-zinc-500 translate-y-[1px]' />
          {item.scrapCount ?? 0}
        </span>
      </div>

      {/* 본문 일부 */}
      {item.content && (
        <p className='mt-3 line-clamp-3 whitespace-pre-line text-sm text-zinc-700'>
          {item.content}
        </p>
      )}

      {/* 하단 */}
      <div className='mt-4 flex items-center justify-between'>
        {/* ✅ 모달 안에 ArticleDetail 직접 렌더링 */}
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <Button variant='outline' size='sm' className='h-8'>
              더보기
            </Button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className='fixed inset-0 bg-black/40' />
            <Dialog.Content className='fixed left-1/2 top-1/2 z-50 h-[85vh] w-[95vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-4 shadow-xl'>
              <div className='mb-3 flex items-center justify-between border-b pb-2'>
                <Dialog.Title className='text-base font-semibold'>
                  기사 보기
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className='rounded p-1 hover:bg-zinc-100'>✕</button>
                </Dialog.Close>
              </div>

              {/* 핵심: props 전달 + 콜백 */}
              <ArticleDetail
                articleId={item.id}
                onScrapChange={(articleId, next) => {
                  // 모달 내부에서 스크랩 상태가 바뀌면, 카드/리스트를 즉시 갱신
                  onToggleScrap(articleId, next);
                }}
              />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* 스크랩 토글 버튼 (목록에서 직접 토글) */}
        <button
          onClick={() => onToggleScrap(item.id, !scrapped)}
          aria-pressed={scrapped}
          className='inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm hover:bg-zinc-50'
        >
          {scrapped ? (
            <BookmarkCheck className='h-4 w-4 text-yellow-500' />
          ) : (
            <Bookmark className='h-4 w-4 text-zinc-500' />
          )}
          {scrapped ? '스크랩됨' : '스크랩'}
        </button>
      </div>
    </article>
  );
}
