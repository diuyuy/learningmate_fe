import type { Keyword as RawKeyword } from '@/features/keywords/types/types';

export type Keyword = {
  id: number;
  name: string;
};

export type Video = {
  id: number;
  keyword: RawKeyword;
  link: string;
};

export type ApiResponse<T> = {
  status: number;
  message: string;
  result: T;
};
