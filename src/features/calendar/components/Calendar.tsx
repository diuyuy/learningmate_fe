import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReviewStore } from '../store/calendarStore';
import { LegendDot } from './LegendDot';
import { missionClass } from '@/constants/mission';

export default function Calendar({
  onSelect,
  selected,
  size,
}: {
  onSelect: (d: Date) => void;
  selected: Date;
  size?: number;
}) {
  const { cursorMonth, gotoPrevMonth, gotoNextMonth, monthData } =
    useReviewStore();
  const title = format(cursorMonth, 'yyyy년 M월', { locale: ko });

  // 해당 월 1일 ~ 말일만 포함된 days
  const days = monthData;

  return (
    <div
      className='rounded-2xl border bg-background p-4 md:p-6 shadow-sm w-full'
      style={{ maxWidth: size }}
    >
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-xl font-semibold'>{title}</h3>
        <div className='flex gap-2'>
          <Button
            variant='secondary'
            size='icon'
            onClick={gotoPrevMonth}
            aria-label='이전 달'
            className='cursor-pointer'
          >
            <ChevronLeft className='h-5 w-5' />
          </Button>
          <Button
            variant='secondary'
            size='icon'
            onClick={gotoNextMonth}
            aria-label='다음 달'
            className='cursor-pointer'
          >
            <ChevronRight className='h-5 w-5' />
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-7 text-center text-xs md:text-sm text-muted-foreground border-t border-l'>
        {'일월화수목금토'.split('').map((d, idx) => (
          <div
            key={d}
            className={[
              'py-2 border-r border-b',
              idx === 0 ? 'text-red-600' : '',
              idx === 6 ? 'text-blue-600' : '',
            ].join(' ')}
          >
            {d}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-7 border-l border-t'>
        {days.map(({ date, missionLevel, hasData }, idx) => {
          const isSelected = isSameDay(date, selected);

          const col = idx % 7;
          const dayColorClass =
            col === 0
              ? 'text-red-600'
              : col === 6
                ? 'text-blue-600'
                : 'text-foreground';

          const dateISO = format(date, 'yyyy-MM-dd');

          return (
            <button
              key={dateISO}
              onClick={() => {
                if (!hasData) return;
                onSelect(date);
              }}
              aria-disabled={!hasData}
              className={[
                'relative aspect-square border-r border-b transition-colors',
                !hasData
                  ? 'opacity-60 bg-muted/60 cursor-not-allowed'
                  : isSelected
                    ? 'bg-primary/40 cursor-pointer'
                    : 'bg-card hover:bg-accent cursor-pointer',
              ].join(' ')}
            >
              <div className='flex h-full flex-col items-center justify-center'>
                <span
                  className={[
                    'text-sm md:text-base',
                    isSelected ? 'font-bold' : '',
                    dayColorClass,
                  ].join(' ')}
                >
                  {format(date, 'd')}
                </span>
              </div>

              {missionLevel !== null && (
                <span
                  className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full ${missionClass[missionLevel]}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 범례 (작게) */}
      <div className='mt-4'>
        <div className='mx-auto max-w-sm rounded-xl border bg-muted/30 px-2 py-2'>
          <div className='flex items-center justify-center gap-3 text-[10px] md:text-xs text-muted-foreground'>
            <span>미션 성공 : </span>
            <LegendDot className={missionClass[3]} label='3개' />
            <LegendDot className={missionClass[2]} label='2개' />
            <LegendDot className={missionClass[1]} label='1개' />
            <LegendDot className={missionClass[0]} label='0개' />
          </div>
        </div>
      </div>
    </div>
  );
}
