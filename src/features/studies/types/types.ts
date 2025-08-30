import type { Keyword } from '@/features/keywords/types/types';
import type { User } from '@/features/members/types/types';

export type Study = {
  id: number;
  user: User;
  keyword: Keyword;
  studyStats: number;
  createdAt: string;
  updatedAt: string;
};
