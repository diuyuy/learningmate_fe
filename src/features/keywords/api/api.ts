import { api } from '@/lib/axios';
import { nowKstDateKey } from '@/lib/timezone';
import type { TodaysKeyword } from '../types/types';

export const fetchTodaysKeyword = async () => {
  const today = nowKstDateKey();
  const response = await api.get(
    `/keywords?startDate=${today}&endDate=${today}`
  );
  return response.data.result[0] as TodaysKeyword;
};
