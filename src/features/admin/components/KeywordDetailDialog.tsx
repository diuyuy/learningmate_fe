import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Keyword } from '@/features/keywords/types/types';

import { QUERY_KEYS } from '@/constants/querykeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'sonner';
import { updateKeyword } from '../api/api';
import { useKeywordInfoForm } from '../hooks/useKeywordInfoForm';
import type { KeywordInfoForm } from '../types/types';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyword: Pick<Keyword, 'id' | 'name' | 'category' | 'description'>;
};

export default function KeywordDetailDialog({
  open,
  onOpenChange,
  keyword,
}: Props) {
  const form = useKeywordInfoForm(keyword);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: [QUERY_KEYS.KEYWORDS, { name: keyword.name }],
    mutationFn: async (keywordInfo: KeywordInfoForm) =>
      updateKeyword(keyword.id, keywordInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.KEYWORDS],
      });
    },
    onError: () => {
      toast.error(
        '키워드 업데이트 도중 에러가 발생했습니다. 다시 시도해주세요.',
        {
          duration: 3000,
          position: 'top-center',
          style: {
            color: 'var(--destructive)',
          },
        }
      );
    },
  });

  const onSubmit = (keywordInfo: KeywordInfoForm) => {
    mutation.mutate(keywordInfo);
  };

  useEffect(() => {
    form.reset({
      name: keyword.name,
      category: keyword.category.name,
      description: keyword.description,
    });
  }, [keyword, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>키워드 상세 정보</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-3 [&_label]:font-semibold'
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name='name'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='form-textarea-name'>이름</FieldLabel>
                  <TextareaAutosize
                    id='form-textarea-name'
                    {...field}
                    className='w-full resize-none border border-input p-2 rounded-md focus-visible:outline-none shadow-xs'
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='category'
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor='form-select-category'>
                    카테고리
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id='form-select-category'
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder='카테고리 선택' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='과학'>과학</SelectItem>
                      <SelectItem value='경제'>경제</SelectItem>
                      <SelectItem value='공공'>공공</SelectItem>
                      <SelectItem value='금융'>금융</SelectItem>
                      <SelectItem value='경영'>경영</SelectItem>
                      <SelectItem value='사회'>사회</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name='description'
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='form-textarea-description'>
                    설명
                  </FieldLabel>
                  <TextareaAutosize
                    {...field}
                    className='w-full resize-none border border-input p-2 rounded-md focus-visible:outline-none shadow-xs max-h-40 md:max-h-80'
                  />
                </Field>
              )}
            />
          </FieldGroup>
          <div className='flex justify-end gap-4'>
            <DialogClose asChild>
              <Button type='button' variant={'outline_semibold'}>
                취소
              </Button>
            </DialogClose>
            <Button
              type='submit'
              variant={'primary_semibold'}
              disabled={!form.formState.isDirty}
            >
              수정
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
