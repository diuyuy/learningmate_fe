// ReviewCreateForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateReviewMutation } from '../hooks/useReviewMutation';

type Props = {
  articleId: number;
  memberId: number;
};

const ReviewSchema = z.object({
  content1: z
    .string()
    .min(10, '기사에 대한 내 생각을 최소 10자 이상 입력하세요.')
    .max(2000, '2000자 이내로 입력하세요.'),
});

type FormValues = z.infer<typeof ReviewSchema>;

export default function ReviewCreateForm({ articleId, memberId }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(ReviewSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: { content1: '' },
  });

  const [isCancelling, setIsCancelling] = useState(false);
  const createMutation = useCreateReviewMutation(articleId);

  const onSubmit = (data: FormValues) => {
    createMutation.mutate(
      { memberId, ...data },
      {
        onSuccess: () => {
          // 훅 내부의 쿼리 무효화로 상위가 목록/조회로 전환됨
          reset({ content1: '' });
        },
      }
    );
  };

  const onCancel = () => {
    setIsCancelling(true);
    reset({ content1: '' });
    // 살짝의 비활성화로 더블클릭 방지
    setTimeout(() => setIsCancelling(false), 150);
  };

  const content = watch('content1') ?? '';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid gap-2'>
        <div className='relative'>
          <Textarea
            id='content1'
            {...register('content1')}
            className='resize-none h-48 w-full pr-14 whitespace-pre-wrap break-words'
            style={{ overflowWrap: 'anywhere' }} // 긴 토큰도 강제 줄바꿈
            placeholder='기사에 대한 내 생각을 입력해주세요'
            maxLength={2000}
            disabled={createMutation.isPending || isCancelling}
            aria-invalid={!!errors.content1}
          />
          <span className='absolute right-2 bottom-2 text-xs text-muted-foreground'>
            {content.length}/2000
          </span>
        </div>
        {errors.content1 && (
          <p className='text-sm text-red-500'>{errors.content1.message}</p>
        )}
      </div>

      <div className='flex justify-end gap-2'>
        <Button
          type='button'
          variant='secondary'
          onClick={onCancel}
          disabled={createMutation.isPending}
        >
          취소
        </Button>
        <Button type='submit' disabled={createMutation.isPending}>
          {createMutation.isPending ? '작성 중...' : '작성'}
        </Button>
      </div>
    </form>
  );
}
