import type {
  StudyAchievement,
  StudyCategoryGraph,
} from '@/features/my/types/achievement';
import { api } from '@/lib/axios';

// 서버가 data.result 또는 data로 값을 줄 수 있어 안전 언랩
const unwrap = <T>(data: any): T => (data?.result ?? data) as T;

/** GET /members/me/study-achivements */
export async function fetchStudyAchievement() {
  const res = await api.get('/members/me/study-achievements');
  return unwrap<StudyAchievement>(res.data);
}

/** GET /members/me/study-category-statistics */
export async function fetchStudyCategoryStats() {
  const res = await api.get('/members/me/study-category-statistics');
  return unwrap<StudyCategoryGraph>(res.data);
}
