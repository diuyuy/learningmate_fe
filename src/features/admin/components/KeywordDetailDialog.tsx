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
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import type { KeywordWithVideo } from '@/features/keywords/types/types';
import { formatKST } from '@/lib/timezone';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyword: Pick<
    KeywordWithVideo,
    'id' | 'name' | 'category' | 'description' | 'date'
  >;
};

export default function KeywordDetailDialog({
  open,
  onOpenChange,
  keyword,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>키워드 상세 정보</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-3 [&_label]:font-semibold'>
          <FieldGroup>
            <Field>
              <FieldLabel>이름</FieldLabel>
              <p className='w-full border border-input p-2 rounded-md shadow-xs bg-muted/30'>
                {keyword.name}
              </p>
            </Field>
            <Field>
              <FieldLabel>날짜</FieldLabel>
              <p className='w-full border border-input p-2 rounded-md shadow-xs bg-muted/30'>
                {keyword.date ? formatKST(keyword.date, 'yyyy-MM-dd') : '-'}
              </p>
            </Field>
            <Field>
              <FieldLabel>카테고리</FieldLabel>
              <p className='w-full border border-input p-2 rounded-md shadow-xs bg-muted/30'>
                {keyword.category.name}
              </p>
            </Field>
            <Field>
              <FieldLabel>설명</FieldLabel>
              <p className='w-full border border-input p-2 rounded-md shadow-xs bg-muted/30 whitespace-pre-wrap max-h-40 md:max-h-80 overflow-y-auto'>
                {keyword.description}
              </p>
            </Field>
          </FieldGroup>
          <div className='flex justify-end'>
            <DialogClose asChild>
              <Button type='button' variant={'outline_semibold'}>
                닫기
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
