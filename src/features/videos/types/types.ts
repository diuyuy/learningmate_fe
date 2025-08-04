import type { Keyword } from '@/features/keywords/types/types';

export type Video = {
  id: number;
  keyword: Keyword;
  link: string;
};
