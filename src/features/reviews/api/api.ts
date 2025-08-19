import { api } from '@/lib/axios';
import type { Review, ReviewProps } from '../types/types';

const SIZE = 10;

export const fetchReviews = async ({
  keywordId = 340,
  page = 0,
}: ReviewProps): Promise<Review[]> => {
  const res = await api.get(
    `/keywords/${keywordId}/reviews?page=${page}&size=${SIZE}&sort=id`
  );

  return res.data.result;
};
