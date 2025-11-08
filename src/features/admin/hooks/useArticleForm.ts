import type { Article } from '@/features/articles/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArticleSchema } from '../types/types';

export const useArticleForm = (article?: Article) => {
  return useForm({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      title: article?.title ?? '',
      content: article?.content ?? '',
      summary: article?.summary ?? '',
    },
  });
};
