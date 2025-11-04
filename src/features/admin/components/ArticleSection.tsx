import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { QUERY_KEYS } from '@/constants/querykeys';
import { useArticlePreviewsQuery } from '@/features/articles/hooks/useArticlePreviewsQuery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createArticle, fetchBatchJobState } from '../api/api';
import type { JobState } from '../types/types';
import ArticleItem from './ArticleItem';

type Props = {
  keywordId: number;
};

const getBatchJobKey = (keywordId: number) => `BATCH_JOBS:${keywordId}`;

export default function ArticleSection({ keywordId }: Props) {
  const queryClient = useQueryClient();
  const { isPending, isError, data } = useArticlePreviewsQuery(keywordId);
  const [jobState, setJobState] = useState<JobState>('unknown');

  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.ARTICLE, { action: 'create' }],
    mutationFn: async (keywordId: number) => createArticle(keywordId),
    onSuccess: async (job) => {
      localStorage.setItem(getBatchJobKey(keywordId), job.jobId);
    },
  });

  const handleCreateArticle = () => {
    setJobState('active');
    mutation.mutate(keywordId);
  };

  useEffect(() => {
    // keywordId 변경 시 jobState 리셋
    setJobState('unknown');
  }, [keywordId]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const batchJobKey = getBatchJobKey(keywordId);

    // 초기 마운트 시 진행 중인 job 확인
    const existingJobId = localStorage.getItem(batchJobKey);
    if (existingJobId && jobState === 'unknown') {
      setJobState('active');
    }

    if (jobState === 'active') {
      intervalId = setInterval(async () => {
        const jobId = localStorage.getItem(batchJobKey);

        if (!jobId) {
          setJobState('unknown');
          return;
        }

        try {
          const { state: currJobState } = await fetchBatchJobState(jobId);
          console.log('🚀 ~ ArticleSection ~ currJobState:', currJobState);

          if (currJobState === 'completed') {
            localStorage.removeItem(batchJobKey);
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.ARTICLE_PREVIEWS],
            });
            setJobState(currJobState);
            return;
          }

          if (currJobState === 'failed') {
            localStorage.removeItem(batchJobKey);
            setJobState(currJobState);
            return;
          }
        } catch (error) {
          console.error('Failed to fetch job state:', error);
          // 에러 발생 시 계속 재시도
        }
      }, 10000); // 10초마다 폴링
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jobState, queryClient, keywordId]);

  if (isPending) {
    return <ArticleSectionSkeleton />;
  }

  if (isError) {
    return <ArticleSectionError />;
  }

  return (
    <section>
      <div className='flex justify-between mb-8'>
        <h2 className='text-2xl font-bold'>Articles</h2>
        <Button
          type='button'
          variant={'secondary'}
          disabled={
            data.length !== 0 || jobState === 'active' || mutation.isPending
          }
          onClick={handleCreateArticle}
          className='font-semibold'
        >
          <PlusIcon /> Add new Article
        </Button>
      </div>
      {data.length === 0 ? (
        jobState === 'active' ? (
          <ArticleCreatingLoader />
        ) : (
          <p className='text-center'>등록된 Article이 없습니다.</p>
        )
      ) : (
        <ul className='space-y-3 divide-y'>
          {data.map((article) => (
            <li>
              <ArticleItem
                keywordId={keywordId}
                articleId={article.id}
                title={article.title}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ArticleSectionSkeleton() {
  return (
    <section>
      <div className='flex justify-between mb-8'>
        <h2 className='text-2xl font-bold'>Articles</h2>
        <Button
          type='button'
          variant={'secondary'}
          disabled
          className='font-semibold'
        >
          <PlusIcon /> Add new Article
        </Button>
      </div>
      <ul className='space-y-3'>
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index}>
            <Skeleton className='h-12 w-full' />
          </li>
        ))}
      </ul>
    </section>
  );
}

function ArticleSectionError() {
  return (
    <section>
      <div className='flex justify-between mb-8'>
        <h2 className='text-2xl font-bold'>Articles</h2>
        <Button
          type='button'
          variant={'secondary'}
          disabled
          className='font-semibold'
        >
          <PlusIcon /> Add new Article
        </Button>
      </div>
      <div className='text-center'>예상치 못한 에러가 발생했습니다.</div>
    </section>
  );
}

function ArticleCreatingLoader() {
  return (
    <div className='space-y-4'>
      <div className='text-center text-muted-foreground'>
        Article을 생성하고 있습니다...
      </div>
      <ul className='space-y-3'>
        {Array.from({ length: 5 }).map((_, index) => (
          <li key={index}>
            <Skeleton className='h-12 w-full' />
          </li>
        ))}
      </ul>
    </div>
  );
}
