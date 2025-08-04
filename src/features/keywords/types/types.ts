import type { Category } from '@/types/types';

export type Keyword = {
  id: number;
  name: string;
  description: string;
  category: Category;
};

export type TodaysKeyword = {
  id: number;
  keyword: Keyword;
  date: string; // YYYY-MM-DD
};
