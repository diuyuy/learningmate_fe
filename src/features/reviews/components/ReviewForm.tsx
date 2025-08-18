import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { postReview } from '../api/api';
import type { ReviewForm } from '../types/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { Textarea } from '@/components/ui/textarea';
import { z } from "zod";
import { AxiosError } from 'axios';

const ReviewSchema = z.object({
  articleId: z.number().int().positive(),
  content1: z.string().trim().min(10, "기사에 대한 내 생각을 최소 10자 이상 입력하세요.").max(2000, "2000자 이내로 입력하세요."),
  content2: z.string().trim().min(10, "어려웠던 용어 정리를 최소 10자 이상 입력하세요.").max(2000, "2000자 이내로 입력하세요."),
  content3: z.string().trim().min(10, "개인적으로 공부한 내용을 최소 10자 이상 입력하세요.").max(2000, "2000자 이내로 입력하세요."),
});

export default function ReviewForm() {
  const { articleId } = useParams();
  const queryClient = useQueryClient()

  // 리뷰 작성
  const mutation = useMutation({
    mutationFn: (payload: ReviewForm) => postReview(payload, Number(articleId)),
    onSuccess: () => {
      // TODO: staleTime 고려
      queryClient.invalidateQueries({ queryKey: ['review'] })
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        const msg = (error.response?.data as any)?.message ?? error.message;
        alert(msg);
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("알 수 없는 오류");
      }
    }

  });

  // TODO: 로그인 구현 시 수정
  const memberId = 5;

  const handleCreateReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 리뷰 작성 후 새로고침 방지
    const formData = new FormData(e.currentTarget);

    const content1 = formData.get("content1")?.toString();
    const content2 = formData.get("content2")?.toString();
    const content3 = formData.get("content3")?.toString();

    const parsed = ReviewSchema.safeParse({
      articleId: Number(articleId), // useParams로 받은 건 string이라 Number 변환 필요
      content1,
      content2,
      content3,
    });

    if (!parsed.success) {
      alert(parsed.error.issues[0].message);
      return;
    }

    mutation.mutate({ memberId, ...parsed.data});
  };

  return (
      <article className="flex flex-col gap-5 w-full mt-5 border p-3">
      <header>
        <h2 className="font-bold">기사 제목 : ABCDEFGHIJKLMNOPQRSTUVWXYZ</h2>
      </header>

      <form onSubmit={handleCreateReview} className="flex flex-col gap-6 w-full">
        <div className="grid w-full gap-2">
          <Label htmlFor="content1">기사에 대한 내 생각</Label>
          <Textarea
            id="content1"
            name="content1"
            className='resize-none h-40 w-full'
            placeholder="기사에 대한 내 생각을 입력해주세요"
          />
        </div>

        <div className="grid w-full gap-2">
          <Label htmlFor="content2">어려웠던 용어 정리</Label>
          <Textarea
            id="content2"
            name="content2"
            className='resize-none h-40 w-full'
            placeholder="어려웠던 용어를 입력해주세요"
          />
        </div>

        <div className="grid w-full gap-2">
          <Label htmlFor="content3">개인적으로 더 공부한 내용</Label>
          <Textarea
            id="content3"
            name="content3"
            className='resize-none h-40 w-full'
            placeholder="더 공부한 내용을 입력해주세요"
          />
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={mutation.isPending}>
              {mutation.isPending ? "작성 중..." : "작성"}
          </Button>
        </div>
      </form>
    </article>
  );
}
