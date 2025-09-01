import { useQuery } from '@tanstack/react-query';
import { getMonth, getYear } from 'date-fns';
import { fetchStudyStatus } from '../api/api';
import type { StudyStatusItem } from '../types/types';
import { VIDEO, REVIEW, QUIZ } from '../types/types';

/** 비디오(4) | 리뷰(2) | 퀴즈(1) → 0..7 */
function toMissionBits(item: StudyStatusItem): number {
  let bits = 0;
  if (item.videoCompleted) bits |= VIDEO; // 4
  if (item.reviewCompleted) bits |= REVIEW; // 2
  if (item.quizCompleted) bits |= QUIZ; // 1
  return bits & 7;
}

/** 날짜 키: 타임존 안전하게 'YYYY-MM-DD'만 사용. updatedAt을 우선. */
function getDateKey(item: StudyStatusItem): string {
  const c = (item.createdAt ?? '').slice(0, 10); // 'YYYY-MM-DD'
  const u = (item.updatedAt ?? '').slice(0, 10);
  // 러닝 페이지와 맞추기 위해 updatedAt 우선 사용
  return u || c;
}

export function useStudyStatusByMonth(anchorMonth: Date) {
  const year = getYear(anchorMonth);
  const month = getMonth(anchorMonth) + 1; // 1..12

  return useQuery({
    queryKey: ['study-status', year, month],
    queryFn: () => fetchStudyStatus(year, month),
    select: (items: StudyStatusItem[]) => {
      // ✅ 같은 날짜의 여러 레코드를 비트 OR로 집계
      const byDate = new Map<string, number>();
      for (const item of items) {
        const key = getDateKey(item);
        const bits = toMissionBits(item);
        const prev = byDate.get(key) ?? 0;
        byDate.set(key, (prev | bits) & 7);
      }
      return byDate; // Map<'YYYY-MM-DD', 0..7>
    },
    placeholderData: (prev) => prev,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
    gcTime: 600_000,
  });
}
