import { api } from '@/lib/axios';
import type { Member } from '../types/types';

export const fetchMember = async () => {
  const response = await api.get('/members/me');
  return response.data.result as Member;
};
