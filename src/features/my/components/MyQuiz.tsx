import QuizStatCard from '@/features/my/components/QuizStatCard';
import IncorrectQuizList from '@/features/my/components/IncorrectQuizList';
import { useQuizStatistics } from '@/features/my/hooks/useQuizStatistics';
import SectionHeader from '@/features/my/components/SectionHeader';
import { TOKENS } from '../config/PageMeta';

export default function MyQuiz() {
  const { data, isLoading } = useQuizStatistics();

  return (
    <section className={TOKENS.sectionGapY}>
      <SectionHeader page='quiz' />

      {/* 성적 요약 → 카드 유지 */}
      <QuizStatCard
        correctCounts={data?.correctCounts ?? 0}
        totalCounts={data?.totalCounts ?? 0}
        isLoading={isLoading}
      />

      {/* 틀린 문제 리스트 → 카드 wrapper 제거 */}
      <IncorrectQuizList />
    </section>
  );
}
