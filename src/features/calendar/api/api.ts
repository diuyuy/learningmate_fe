import { api } from '@/lib/axios';
import type { StudyStatusItem, StudyStatusResponse } from '../types/types';

export const fetchStudyStatus = async (year: number, month: number) => {
  const response = await api.get<StudyStatusResponse>(
    '/members/me/study-status',
    { params: { year, month } }
  );

  return response.data.result as StudyStatusItem[];
};
