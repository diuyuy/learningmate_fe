import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { tz } from '@date-fns/tz';
import { fetchStudyStatus } from '../api/api';
import type { StudyStatusItem } from '../types/types';
import { VIDEO, REVIEW, QUIZ } from '../types/types';
import { kstDateKeyFromBackend } from '@/lib/timezone';

const KST = tz('Asia/Seoul');

function toMissionBits(item: StudyStatusItem): number {
  let bits = 0;
  if (item.videoCompleted) bits |= VIDEO;
  if (item.reviewCompleted) bits |= REVIEW;
  if (item.quizCompleted) bits |= QUIZ;
  return bits & 7;
}

function getDateKey(item: StudyStatusItem): string {
  if (item.updatedAt) return kstDateKeyFromBackend(item.updatedAt);
  if (item.createdAt) return kstDateKeyFromBackend(item.createdAt);
  return '';
}

export function useStudyStatusByMonth(anchorMonth: Date) {
  const year = Number(format(anchorMonth, 'yyyy', { in: KST }));
  const month = Number(format(anchorMonth, 'M', { in: KST }));

  return useQuery({
    queryKey: ['study-status', year, month],
    queryFn: () => fetchStudyStatus(year, month),
    select: (items: StudyStatusItem[]) => {
      const byDate = new Map<string, number>();
      for (const item of items) {
        const key = getDateKey(item);
        if (!key) continue;
        const prev = byDate.get(key) ?? 0;
        byDate.set(key, (prev | toMissionBits(item)) & 7);
      }
      return byDate;
    },
    placeholderData: (prev) => prev,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
    gcTime: 600_000,
  });
}
