import QuizStatCard from '@/features/my/components/QuizStatCard';
import IncorrectQuizList from '@/features/my/components/IncorrectQuizList';
import { useQuizStatistics } from '@/features/my/hooks/useQuizStatistics';

export default function MyQuiz() {
  const { data, isLoading } = useQuizStatistics();

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-bold tracking-tight'>퀴즈</h3>
      {/* 퀴즈 성과 (풀 너비) */}
      <QuizStatCard
        correctCounts={data?.correctCounts ?? 0}
        totalCounts={data?.totalCounts ?? 0}
        isLoading={isLoading}
      />

      {/* 틀린 문제 (아코디언) */}
      <IncorrectQuizList />
    </div>
  );
}
