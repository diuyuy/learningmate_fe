import { format, isSameDay, getDay, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  PlayCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReviewStore } from '../store/calendarStore';

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
  const days = monthData;

  const firstWeekday = days.length > 0 ? getDay(days[0].date) : 0; // 0=일..6=토
  const leading = firstWeekday;
  const trailing =
    days.length > 0 ? (7 - ((leading + days.length) % 7)) % 7 : 0;

  return (
    <div
      className={[
        'rounded-2xl border bg-background p-4 md:p-6 shadow-sm w-full',
        'mx-auto md:mx-0 max-w-[22rem] sm:max-w-md md:max-w-none',
      ].join(' ')}
      style={{ maxWidth: size }}
      role='group'
      aria-label={`${title} 캘린더`}
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
            aria-hidden
          >
            {d}
          </div>
        ))}
      </div>

      <div className='grid grid-cols-7 border-l border-t'>
        {Array.from({ length: leading }).map((_, i) => (
          <div
            key={`lead-${i}`}
            aria-hidden
            className='aspect-square border-r border-b bg-muted/50'
          />
        ))}

        {days.map(({ date, hasData, missionBits }) => {
          const selectedDay = isSameDay(date, selected);
          const today = isToday(date);
          const weekday = getDay(date);

          const dayColorClass =
            weekday === 0
              ? 'text-red-600'
              : weekday === 6
                ? 'text-blue-600'
                : 'text-foreground';

          const dateISO = format(date, 'yyyy-MM-dd');
          const label = format(date, 'yyyy년 M월 d일 (EEE)', { locale: ko });

          return (
            <button
              key={dateISO}
              onClick={() => {
                if (!hasData) return;
                onSelect(date);
              }}
              aria-disabled={!hasData}
              disabled={!hasData}
              aria-pressed={selectedDay}
              aria-label={`${label}${hasData ? '' : ' (데이터 없음)'}`}
              className={[
                'relative aspect-square border-r border-b transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70',
                !hasData
                  ? 'opacity-60 bg-muted/60 cursor-not-allowed'
                  : selectedDay
                    ? 'bg-primary/40 cursor-pointer'
                    : 'bg-card hover:bg-accent cursor-pointer',
              ].join(' ')}
            >
              <div className='flex h-full flex-col items-center justify-center'>
                <span
                  className={[
                    'text-sm md:text-base',
                    selectedDay || today ? 'font-bold' : '',
                    dayColorClass,
                  ].join(' ')}
                >
                  {format(date, 'd')}
                </span>
                {today && <span className='sr-only'>오늘</span>}
              </div>

              {missionBits !== null && missionBits !== undefined && (
                <div className='absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5'>
                  {Array.from({ length: 3 }).map((_, idx) => {
                    const bit = (missionBits >> (2 - idx)) & 1; // 왼쪽부터 4,2,1
                    const colorClass = bit ? 'bg-green-500' : 'bg-red-500';
                    return (
                      <span
                        key={idx}
                        className={`h-1.5 w-1.5 rounded-full ${colorClass}`}
                        aria-hidden
                      />
                    );
                  })}
                </div>
              )}
            </button>
          );
        })}

        {Array.from({ length: trailing }).map((_, i) => (
          <div
            key={`trail-${i}`}
            aria-hidden
            className='aspect-square border-r border-b bg-muted/50'
          />
        ))}
      </div>

      <div className='mt-4'>
        <div className='mx-auto max-w-sm rounded-xl border bg-muted/30 px-3 py-3'>
          <div className='flex items-center justify-center gap-4 text-[10px] md:text-xs text-muted-foreground mb-2'>
            <span className='font-medium'>순서 :</span>
            <div className='flex items-center gap-1'>
              <HelpCircle className='h-3 w-3' />
              <span>퀴즈</span>
            </div>
            <div className='flex items-center gap-1'>
              <BookOpen className='h-3 w-3' />
              <span>리뷰</span>
            </div>
            <div className='flex items-center gap-1'>
              <PlayCircle className='h-3 w-3' />
              <span>비디오</span>
            </div>
          </div>
          <div className='flex items-center justify-center gap-6 text-[10px] md:text-xs text-muted-foreground'>
            <div className='flex items-center gap-1'>
              <span className='inline-block h-2 w-2 rounded-full bg-green-500' />
              <span>완료</span>
            </div>
            <div className='flex items-center gap-1'>
              <span className='inline-block h-2 w-2 rounded-full bg-red-500' />
              <span>미완료</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
