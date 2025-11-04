// src/features/main/hooks/useMainStudyAchievements.ts
import { useQuery } from '@tanstack/react-query';
import { fetchMainStudyAchievements } from '../api/main';

export const useMainStudyAchievements = () => {
  return useQuery({
    queryKey: ['me', 'main-study-achievements'],
    queryFn: fetchMainStudyAchievements,
    // 하루 동안은 캐시 사용(원하면 조정)
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
