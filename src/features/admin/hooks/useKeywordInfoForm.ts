import type { KeywordWithVideo } from '@/features/keywords/types/types';
import { formatKST } from '@/lib/timezone';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { KeywordInfoSchema } from '../types/types';

export const useKeywordInfoForm = (
  keyword: Pick<KeywordWithVideo, 'name' | 'category' | 'description' | 'date'>
) => {
  return useForm({
    resolver: zodResolver(KeywordInfoSchema),
    defaultValues: {
      name: keyword.name,
      category: keyword.category.name,
      description: keyword.description,
      date: keyword.date ? formatKST(keyword.date, 'yyyy-MM-dd') : '',
    },
  });
};
