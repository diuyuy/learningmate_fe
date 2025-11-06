import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} from '../hooks/useReviewMutation';
import type { ReviewResponse } from '../types/types';

type Props = {
  articleId: number;
  memberId: number;
  initial: ReviewResponse;
  onDeleted?: () => void; // ✅ 추가: 삭제 알림 콜백
};

const ReviewSchema = z.object({
  content1: z
    .string()
    .min(10, '기사에 대한 내 생각을 최소 10자 이상 입력하세요.')
    .max(2000),
});
type FormValues = z.infer<typeof ReviewSchema>;

export default function ReviewUpdateView({
  articleId,
  memberId,
  initial,
  onDeleted,
}: Props) {
  const reviewId = initial.id;
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(ReviewSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: { content1: initial.content1 },
  });

  const updateMutation = useUpdateReviewMutation(articleId, reviewId);
  const deleteMutation = useDeleteReviewMutation(articleId, reviewId, {
    onSuccess: () => {
      reset({ content1: '' });
      onDeleted?.(); // ✅ 부모에 즉시 알림 → 작성 폼으로 전환
    },
  });

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate(
      { memberId, ...data },
      { onSuccess: () => setIsEditing(false) }
    );
  };

  const content = watch('content1') ?? '';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid gap-2'>
        <Label htmlFor='content1'>기사에 대한 내 생각</Label>
        <div className='relative'>
          <Textarea
            id='content1'
            {...register('content1')}
            wrap='soft'
            className='resize-none h-48 w-full pr-14 whitespace-pre-wrap break-words'
            style={{ overflowWrap: 'anywhere' }}
            placeholder='기사에 대한 내 생각을 입력해주세요'
            maxLength={2000}
            disabled={
              !isEditing || updateMutation.isPending || deleteMutation.isPending
            }
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
        {!isEditing ? (
          <>
            <Button
              type='button'
              variant='secondary'
              onClick={() => setIsEditing(true)}
              disabled={updateMutation.isPending || deleteMutation.isPending}
            >
              수정
            </Button>
            <Button
              type='button'
              variant='destructive'
              onClick={() => {
                if (confirm('정말 삭제하시겠습니까?')) deleteMutation.mutate();
              }}
              disabled={updateMutation.isPending || deleteMutation.isPending}
            >
              {deleteMutation.isPending ? '삭제 중...' : '삭제'}
            </Button>
          </>
        ) : (
          <>
            <Button
              type='button'
              variant='ghost'
              onClick={() => {
                reset({ content1: initial.content1 });
                setIsEditing(false);
              }}
              disabled={updateMutation.isPending}
            >
              취소
            </Button>
            <Button
              type='submit'
              disabled={!isDirty || updateMutation.isPending}
            >
              {updateMutation.isPending ? '적용 중...' : '적용'}
            </Button>
          </>
        )}
      </div>
    </form>
  );
}
