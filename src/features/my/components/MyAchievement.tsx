import AchievementSummary from '@/features/my/components/AchievementSummary';

import {
  useStudyAchievement,
  useStudyCategoryStats,
} from '@/features/my/hooks/useStudyAchievement';
import CategoryPie from './CategoryPie';

export default function MyAchievement() {
  // /api/v1/members/me/study-achivements
  const achievementQ = useStudyAchievement();
  // /api/v1/members/me/study-category-statistics
  const categoryStatsQ = useStudyCategoryStats();

  return (
    <div className='space-y-4 md:space-y-6'>
      {/* 실제 화면 카드들 */}
      <h3 className='mb-4 text-lg font-semibold'>학습 성취도</h3>
      <AchievementSummary
        achievement={achievementQ.data}
        isLoading={achievementQ.isLoading}
      />
      <CategoryPie
        stats={categoryStatsQ.data}
        isLoading={categoryStatsQ.isLoading}
      />
    </div>
  );
}
