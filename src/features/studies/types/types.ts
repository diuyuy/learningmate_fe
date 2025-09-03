import type { Keyword } from '@/features/keywords/types/types';
import type { Member } from '@/features/members/types/types';

export type Study = {
  id: number;
  user: Member;
  keyword: Keyword;
  studyStats: number;
  createdAt: string;
  updatedAt: string;
};
