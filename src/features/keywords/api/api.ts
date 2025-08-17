import { api } from '@/lib/axios';
import type { TodaysKeyword } from '../types/types';

export const fetchTodaysKeyword = async () => {
  const date = new Date();
  const today = date.toISOString().slice(0, 10);

  const response = await api.get(
    `/keywords?startDate=${today}&endDate=${today}`
  );

  return response.data.result[0] as TodaysKeyword;
};
