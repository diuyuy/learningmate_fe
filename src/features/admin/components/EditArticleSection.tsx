import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { QUERY_KEYS } from '@/constants/querykeys';
import { useArticleQuery } from '@/features/articles/hooks/useArticleQuery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircleIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import { updateArticle } from '../api/api';
import { useArticleForm } from '../hooks/useArticleForm';
import type { ArticleForm } from '../types/types';
import ActionResultDialog from './ActionResultDialog';

type Props = {
  keywordId: number;
  articleId: number;
};

export default function EditArticleSection({ keywordId, articleId }: Props) {
  const {
    isPending,
    isError,
    data: article,
    refetch,
  } = useArticleQuery(articleId);

  const form = useArticleForm(article);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = (open: boolean) => setIsDialogOpen(open);

  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const handleErrorDialogOpen = (open: boolean) => setIsErrorDialogOpen(open);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.ARTICLE, articleId],
    mutationFn: async (formData: ArticleForm) =>
      updateArticle(articleId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ARTICLE_PREVIEWS, keywordId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ARTICLE, articleId],
      });
      setIsDialogOpen(true);
    },
    onError: () => {
      handleErrorDialogOpen(true);
    },
  });

  const onSubmit = (formData: ArticleForm) => {
    mutation.mutate(formData);
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto';
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    form.reset({
      title: article?.title ?? '',
      content: article?.content ?? '',
      summary: article?.summary ?? '',
    });
  }, [article, form]);

  if (isPending) return <ArticleSectionSkeleton />;
  if (isError) return <ArticleSectionError refetch={refetch} />;

  return (
    <section className='w-full max-w-2xl mx-auto space-y-6'>
      {/* 헤더 */}
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Article Editor</h2>
        <p className='text-sm text-muted-foreground'>
          Article의 제목, 내용, 요약을 수정할 수 있습니다
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className='shadow-sm'>
          <CardHeader>
            <CardTitle className='text-xl font-semibold'>
              Article 수정
            </CardTitle>
            <CardAction>
              <Button
                type='submit'
                variant={'primary_semibold'}
                disabled={!form.formState.isDirty || mutation.isPending}
                className='shadow-sm hover:shadow transition-all duration-200'
              >
                수정
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            <Card className='shadow-sm hover:shadow-md transition-all duration-200'>
              <CardHeader>
                <CardTitle className='font-semibold'>Article Title</CardTitle>
                <CardAction>
                  <Button
                    type='button'
                    variant={'outline_semibold'}
                    onClick={() => form.resetField('title')}
                    disabled={!form.getFieldState('title').isDirty}
                    className='shadow-sm hover:shadow transition-all duration-200'
                  >
                    리셋
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <Controller
                  control={form.control}
                  name='title'
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <TextareaAutosize
                        {...field}
                        placeholder='Article Title...'
                        className='w-full resize-none border border-input bg-background p-3 rounded-md focus-visible:outline-none'
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </CardContent>
            </Card>
            <Card className='shadow-sm hover:shadow-md transition-all duration-200'>
              <CardHeader>
                <CardTitle className='font-semibold'>Article Content</CardTitle>
                <CardAction>
                  <Button
                    type='button'
                    variant={'outline_semibold'}
                    onClick={() => form.resetField('content')}
                    disabled={!form.getFieldState('content').isDirty}
                    className='shadow-sm hover:shadow transition-all duration-200'
                  >
                    리셋
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <Controller
                  control={form.control}
                  name='content'
                  render={({ field: { ref, ...rest }, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <TextareaAutosize
                        {...rest}
                        ref={(e) => {
                          ref(e);
                          contentRef.current = e;
                        }}
                        placeholder='Article Content...'
                        className='w-full resize-none border border-input bg-background p-3 rounded-md focus-visible:outline-none'
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </CardContent>
            </Card>
            <Card className='shadow-sm hover:shadow-md transition-all duration-200'>
              <CardHeader>
                <CardTitle className='font-semibold'>Article Summary</CardTitle>
                <CardAction>
                  <Button
                    type='button'
                    variant={'outline_semibold'}
                    onClick={() => form.resetField('summary')}
                    disabled={!form.getFieldState('summary').isDirty}
                    className='shadow-sm hover:shadow transition-all duration-200'
                  >
                    리셋
                  </Button>
                </CardAction>
              </CardHeader>
              <CardContent>
                <Controller
                  control={form.control}
                  name='summary'
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <TextareaAutosize
                        {...field}
                        placeholder='Article Summary...'
                        className='w-full resize-none border border-input bg-background p-3 rounded-md focus-visible:outline-none'
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </form>
      <ActionResultDialog
        isOpen={isDialogOpen}
        content='Article 수정이 완료됐습니다.'
        handleDialogOpen={handleDialogOpen}
      />
      <ActionResultDialog
        isOpen={isErrorDialogOpen}
        handleDialogOpen={handleErrorDialogOpen}
        content='예상치 못한 에러가 발생했습니다. 다시 시도해주세요.'
      />
    </section>
  );
}

function ArticleSectionSkeleton() {
  return (
    <section className='w-full max-w-2xl mx-auto space-y-6'>
      {/* 헤더 */}
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Article Editor</h2>
        <p className='text-sm text-muted-foreground'>
          Article의 제목, 내용, 요약을 수정할 수 있습니다
        </p>
      </div>

      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle className='text-xl font-semibold'>Article 수정</CardTitle>
          <CardAction>
            <Skeleton className='h-10 w-16' />
          </CardAction>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <Card className='shadow-sm'>
            <CardHeader>
              <Skeleton className='h-8 w-48' />
              <CardAction>
                <Skeleton className='h-10 w-16' />
              </CardAction>
            </CardHeader>
            <CardContent>
              <Skeleton className='h-24 w-full rounded-md' />
            </CardContent>
          </Card>
          <Card className='shadow-sm'>
            <CardHeader>
              <Skeleton className='h-8 w-48' />
              <CardAction>
                <Skeleton className='h-10 w-16' />
              </CardAction>
            </CardHeader>
            <CardContent>
              <Skeleton className='h-24 w-full rounded-md' />
            </CardContent>
          </Card>
          <Card className='shadow-sm'>
            <CardHeader>
              <Skeleton className='h-8 w-48' />
              <CardAction>
                <Skeleton className='h-10 w-16' />
              </CardAction>
            </CardHeader>
            <CardContent>
              <Skeleton className='h-24 w-full rounded-md' />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </section>
  );
}

function ArticleSectionError({ refetch }: { refetch: () => void }) {
  return (
    <section className='w-full max-w-2xl mx-auto space-y-6'>
      {/* 헤더 */}
      <div className='space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Article Editor</h2>
        <p className='text-sm text-muted-foreground'>
          Article의 제목, 내용, 요약을 수정할 수 있습니다
        </p>
      </div>

      <div className='flex flex-col items-center justify-center py-16 px-6 border border-destructive/20 rounded-lg bg-destructive/5 shadow-sm'>
        <AlertCircleIcon className='w-12 h-12 text-destructive mb-4' />
        <h3 className='text-lg font-semibold text-destructive mb-2'>
          데이터를 불러올 수 없습니다
        </h3>
        <p className='text-sm text-muted-foreground mb-6 text-center'>
          알 수 없는 오류가 발생했습니다. 다시 시도해주세요.
        </p>
        <Button
          variant={'primary_semibold'}
          onClick={() => refetch()}
          className='shadow-sm hover:shadow transition-all duration-200'
        >
          다시 시도
        </Button>
      </div>
    </section>
  );
}
