import { useMemo, useState } from 'react';
import type { IncorrectQuizItem } from '@/features/my/types/quiz';
import * as Accordion from '@radix-ui/react-accordion';
import {
  BookOpen,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Newspaper,
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';

type Props = { item: IncorrectQuizItem; value: string };

export default function IncorrectQuizItem({ item, value }: Props) {
  const [open, setOpen] = useState(false);

  const options = useMemo(
    () =>
      [item.question1, item.question2, item.question3, item.question4].filter(
        Boolean
      ) as string[],
    [item]
  );

  const correctIdx = Number(item.answer) - 1;
  const myIdx = Number(item.memberAnswer) - 1;
  const isCorrectAll = item.answer === item.memberAnswer;

  return (
    <Accordion.Item value={value} className='rounded-xl border bg-white'>
      {/* 헤더 */}
      <Accordion.Header asChild>
        <Accordion.Trigger
          className='
            flex w-full items-center gap-3 px-3 py-3 text-left
            rounded-xl
            transition
            hover:bg-zinc-50
            data-[state=open]:bg-zinc-50
            [&[data-state=open]>svg.chev]:rotate-180
          '
        >
          <span className='shrink-0'>
            {isCorrectAll ? (
              <CheckCircle2 className='h-5 w-5 text-emerald-500' />
            ) : (
              <XCircle className='h-5 w-5 text-rose-500' />
            )}
          </span>
          <span className='min-w-0 flex-1 truncate font-semibold'>
            {item.article.title}
          </span>
          <span className='hidden sm:inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-[11px] text-yellow-800'>
            <Newspaper className='h-3.5 w-3.5' />
            {item.article.keyword?.name ?? '키워드'}
          </span>
          {/* chevron */}
          <svg
            className='chev ml-2 h-4 w-4 transition-transform'
            viewBox='0 0 24 24'
            fill='none'
          >
            <path
              d='M6 9l6 6 6-6'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </Accordion.Trigger>
      </Accordion.Header>

      {/* 컨텐츠 */}
      <Accordion.Content
        className='
          px-3 pb-3
          data-[state=closed]:opacity-0 data-[state=open]:opacity-100
          data-[state=closed]:-translate-y-1 data-[state=open]:translate-y-0
          transition-all duration-300 ease-out
        '
      >
        {/* 불투명 카드로 감싸 비침 방지 */}
        <div className='rounded-xl border bg-white p-4 shadow-sm'>
          {/* 키워드 카드 */}
          <div className='mb-3 rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800'>
            <div className='font-semibold text-yellow-900'>
              {item.article.keyword?.name ?? '키워드'}
            </div>
            <div className='text-yellow-800/80 text-xs'>
              {item.article.keyword?.description ?? '키워드 설명'}
            </div>
          </div>

          {/* 문제 */}
          <p className='mt-1 text-[15px] leading-6 text-zinc-800'>
            <span className='mr-1 font-extrabold'>Q.</span>
            <span className='font-medium'>{item.description}</span>
          </p>

          {/* 보기 */}
          <ul className='mt-3 grid gap-2 sm:grid-cols-2'>
            {options.map((opt, i) => {
              const isCorrect = i === correctIdx;
              const isMine = i === myIdx;
              let cls =
                'flex items-start gap-2 rounded-xl border px-3 py-2 text-sm';
              if (isCorrect) cls += ' border-emerald-500 bg-emerald-50';
              else if (isMine) cls += ' border-rose-400 bg-rose-50';
              else cls += ' border-zinc-200';

              return (
                <li key={i} className={cls}>
                  <span className='mt-0.5 inline-grid h-5 w-5 place-items-center rounded-full bg-zinc-100 text-[11px] text-zinc-600'>
                    {i + 1}
                  </span>
                  <span className='min-w-0 flex-1'>{opt}</span>
                  {isCorrect && (
                    <span className='inline-flex items-center gap-1 text-xs font-medium text-emerald-600'>
                      <CheckCircle2 className='h-4 w-4' /> 정답
                    </span>
                  )}
                  {isMine && !isCorrect && (
                    <span className='inline-flex items-center gap-1 text-xs font-medium text-rose-600'>
                      <XCircle className='h-4 w-4' /> 내 답
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {/* 해설 */}
          <div className='mt-3 rounded-xl bg-zinc-50 p-3 text-sm leading-6 text-zinc-700'>
            <span className='inline-flex items-center gap-1 font-semibold'>
              <BookOpen className='h-4 w-4' /> 해설
            </span>
            <p className='mt-1'>{item.explanation}</p>
          </div>

          {/* 기사 바로가기 (모달) */}
          <div className='mt-3'>
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-7 px-2 text-xs'
                >
                  기사 바로가기 <ExternalLink className='ml-1 h-4 w-4' />
                </Button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className='fixed inset-0 bg-black/40' />
                <Dialog.Content className='fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-xl'>
                  <div className='flex items-center justify-between border-b px-3 py-2'>
                    <Dialog.Title className='text-sm font-semibold'>
                      기사 보기
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button className='rounded p-1 hover:bg-zinc-100'>
                        ✕
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className='h-[75vh]'>
                    <iframe
                      title='article'
                      src={`/article/${item.article.id}`}
                      className='h-full w-full'
                    />
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
