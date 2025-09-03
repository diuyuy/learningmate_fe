import { useQuery } from '@tanstack/react-query';
import type { ReviewListItem } from '../types/types';
import { fetchHotReviewsByDate } from '../api/api';

export function useHotReviews(dateISO: string) {
  return useQuery<ReviewListItem[]>({
    queryKey: ['hot-reviews', dateISO],
    queryFn: () => fetchHotReviewsByDate(dateISO),
    enabled: !!dateISO,
    staleTime: 60 * 1000,
    gcTime: 30 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}
