import Calendar from '@/features/calendar/components/Calendar';
import { useReviewStore } from '@/features/calendar/store/calendarStore';

export default function MainPage() {
  const { setSelectedDate } = useReviewStore();
  return (
    <>
      <div className='p-6 space-y-4'>
        <div className='flex justify-start my-20'>
          <Calendar
            size={350}
            selected={useReviewStore.getState().selectedDate}
            onSelect={(d) => setSelectedDate(d)}
          />
        </div>
      </div>
    </>
  );
}
