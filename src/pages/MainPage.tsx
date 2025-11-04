import Calendar from '@/features/calendar/components/Calendar';
import { useReviewStore } from '@/features/calendar/store/calendarStore';
import MainTopSection from '@/features/main/components/MainTopSection';
import HotReviewsList from '@/features/reviews/components/HotReviewList';

export default function MainPage() {
  const selectedDate = useReviewStore((s) => s.selectedDate);
  const setSelectedDate = useReviewStore((s) => s.setSelectedDate);

  return (
    <div className='mx-auto max-w-6xl px-4 md:px-6 py-6'>
      <MainTopSection />

      <div className='mt-6 grid grid-cols-1 md:grid-cols-[360px_1px_minmax(0,1fr)] gap-y-6 md:gap-x-16'>
        <div className='self-start'>
          <Calendar
            size={360}
            selected={selectedDate}
            onSelect={setSelectedDate}
          />
        </div>

        <div className='hidden w-px bg-border md:block' aria-hidden />

        <div className='pt-1 md:pl-2'>
          <HotReviewsList date={selectedDate} />
        </div>
      </div>
    </div>
  );
}
