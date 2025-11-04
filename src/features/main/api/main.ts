// src/features/main/api/main.ts
import { api } from '@/lib/axios';
import type { MainStudyAchievements } from '../types/types';

export async function fetchMainStudyAchievements(): Promise<MainStudyAchievements> {
  const res = await api.get('/members/me/main-study-achievements');
  // 서버가 { status, message, result } 형태라면:
  return (res.data?.result ?? res.data) as MainStudyAchievements;
}
