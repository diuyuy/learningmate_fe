import type { User } from '@/features/members/types/types';
import type { Category } from '@/types/types';

export type Statistic = {
  id: number;
  user: User;
  category: Category;
  studyCount: number;
};
