import { useQuery } from '@tanstack/react-query';
import {
  fetchStudyAchievement,
  fetchStudyCategoryStats,
} from '@/features/my/api/myAchievement';
import type {
  StudyAchievement,
  StudyCategoryGraph,
} from '@/features/my/types/achievement';

export const MY_QUERY_KEYS = {
  achievement: ['my', 'study-achievements'] as const,
  categoryStats: ['my', 'study-category-stats'] as const,
};

export function useStudyAchievement() {
  return useQuery<StudyAchievement>({
    queryKey: MY_QUERY_KEYS.achievement,
    queryFn: fetchStudyAchievement,
  });
}

export function useStudyCategoryStats() {
  return useQuery<StudyCategoryGraph>({
    queryKey: MY_QUERY_KEYS.categoryStats,
    queryFn: fetchStudyCategoryStats,
  });
}
