// src/features/main/components/MainTopSection.tsx
import TodaysKeywordCard from '@/features/main/components/TodaysKeywordCard';
import TopStatsStrip from '@/features/main/components/TopStatsStrip';
import { useTodaysKeywordQuery } from '@/features/keywords/hooks/useTodaysKeywordQuery';
import { useMainStudyAchievements } from '@/features/main/hooks/useMainStudyAchievements';

export default function MainTopSection() {
  const { data: todayKeyword, isLoading: kwLoading } = useTodaysKeywordQuery();
  const { data: stats, isLoading: stLoading } = useMainStudyAchievements();

  const keywordName = kwLoading ? '' : (todayKeyword?.keyword.name ?? '');
  const keywordDesc = kwLoading
    ? ''
    : (todayKeyword?.keyword.description ?? '');

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthAttendanceTitle = `${year}년 ${month}월 출석일`;

  const monthDays =
    stLoading || !stats
      ? ''
      : `${stats.monthlyAttendanceDays} / ${new Date(year, month, 0).getDate()}`;

  return (
    <section className='mx-auto w-[92vw] max-w-5xl'>
      <div className='rounded-2xl bg-amber-100/90 p-4 sm:p-6 shadow-sm ring-1 ring-amber-200'>
        <TodaysKeywordCard
          keywordName={keywordName}
          keywordDesc={keywordDesc}
        />
        <TopStatsStrip
          monthAttendanceTitle={monthAttendanceTitle}
          monthDays={monthDays}
          totalKeywords={stats?.totalStudiedKeywords ?? 0}
          topCategory={stats?.mostStudiedCategory ?? '-'}
          totalReviews={stats?.totalReviews ?? 0}
        />
      </div>
    </section>
  );
}
