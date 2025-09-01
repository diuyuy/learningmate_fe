import Calendar from '@/features/calendar/components/Calendar';
import { useReviewStore } from '@/features/calendar/store/calendarStore';
import HotReviewsList from '@/features/reviews/components/HotReviewList';

export default function MainPage() {
  // ✅ 셀렉터 분리(가장 안전)
  const selectedDate = useReviewStore((s) => s.selectedDate);
  const setSelectedDate = useReviewStore((s) => s.setSelectedDate);

  return (
    <div className='mx-auto max-w-11/12 px-4 md:px-6 py-6'>
      <div className='grid grid-cols-1 md:grid-cols-[360px_1px_minmax(0,1fr)] gap-y-6 md:gap-x-16'>
        <div className='self-start'>
          <Calendar
            size={360}
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>

        <div className='hidden md:block w-px bg-border' aria-hidden />

        <div className='pt-1 md:pl-2'>
          <HotReviewsList date={selectedDate} />
        </div>
      </div>
    </div>
  );
}
