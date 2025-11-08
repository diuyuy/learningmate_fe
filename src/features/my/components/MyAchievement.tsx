import AchievementSummary from '@/features/my/components/AchievementSummary';
import CategoryPie from '@/features/my/components/CategoryPie';
import SectionHeader from '@/features/my/components/SectionHeader';

import {
  useStudyAchievement,
  useStudyCategoryStats,
} from '@/features/my/hooks/useStudyAchievement';
import { TOKENS } from '../config/pageMeta';

export default function MyAchievement() {
  const achievementQ = useStudyAchievement();
  const categoryStatsQ = useStudyCategoryStats();

  return (
    <section className={TOKENS.sectionGapY}>
      <SectionHeader page='achievement' />
      <AchievementSummary
        achievement={achievementQ.data}
        isLoading={achievementQ.isLoading}
      />
      <CategoryPie
        stats={categoryStatsQ.data}
        isLoading={categoryStatsQ.isLoading}
      />
    </section>
  );
}
