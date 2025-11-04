import type { Keyword } from '@/features/keywords/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { KeywordInfoSchema } from '../types/types';

export const useKeywordInfoForm = (
  keyword: Pick<Keyword, 'name' | 'category' | 'description'>
) => {
  return useForm({
    resolver: zodResolver(KeywordInfoSchema),
    defaultValues: {
      name: keyword.name,
      category: keyword.category.name,
      description: keyword.description,
    },
  });
};
