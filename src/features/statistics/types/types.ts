import type { Member } from '@/features/members/types/types';
import type { Category } from '@/types/types';

export type Statistic = {
  id: number;
  user: Member;
  category: Category;
  studyCount: number;
};
