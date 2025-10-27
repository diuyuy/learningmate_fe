import { CalendarDays, FileText, PlayCircle, HelpCircle } from 'lucide-react';
import type { StudyAchievement } from '@/features/my/types/achievement';

type Props = {
  achievement?: StudyAchievement;
  isLoading?: boolean;
};

export default function AchievementSummary({ achievement, isLoading }: Props) {
  const items = [
    {
      label: '총 출석 일수',
      value: achievement?.studyCounts ?? 0,
      icon: CalendarDays,
    },
    {
      label: '총 리뷰 수',
      value: achievement?.reviewCounts ?? 0,
      icon: FileText,
    },
    {
      label: '푼 퀴즈 수',
      value: achievement?.solvedQuizCounts ?? 0,
      icon: HelpCircle,
    },
    {
      label: '시청 영상 수',
      value: achievement?.watchedVideoCounts ?? 0,
      icon: PlayCircle,
    },
  ];

  return (
    <div className='rounded-2xl border p-4 shadow-sm md:p-6'>
      {/* <h3 className='mb-4 text-lg font-semibold'>학습 성취도</h3> */}
      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        {items.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className='flex items-center gap-3 rounded-xl border p-3'
          >
            <Icon className='h-5 w-5' />
            <div className=''>
              <div className='text-sm text-zinc-500'>{label}</div>
              <div className='text-xl font-semibold'>
                {isLoading ? '—' : value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
