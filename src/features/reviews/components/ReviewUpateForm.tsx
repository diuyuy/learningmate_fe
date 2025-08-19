import { Label } from "@radix-ui/react-label";
import type { ReviewForm, ReviewResponse } from "../types/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview, updateReview } from "../api/api";
import { AxiosError } from "axios";
import z from "zod";
import { useState } from "react";

type Props = {
  articleId: number;
  memberId: number;
  initial: ReviewResponse;
};

const ReviewSchema = z.object({
  articleId: z.number().int().positive(),
  reviewId: z.number().int().positive(),
  content1: z.string().min(10, "기사에 대한 내 생각을 최소 10자 이상 입력하세요.").max(2000, "2000자 이내로 입력하세요."),
  content2: z.string().min(10, "어려웠던 용어 정리를 최소 10자 이상 입력하세요.").max(2000, "2000자 이내로 입력하세요."),
  content3: z.string().min(10, "개인적으로 공부한 내용을 최소 10자 이상 입력하세요.").max(2000, "2000자 이내로 입력하세요."),
});

export default function ReviewUpdateForm({articleId, memberId, initial}:Props) {
  const queryClient = useQueryClient();
  const reviewId=  initial.id;
  const [content1, setContent1] = useState(initial.content1);
  const [content2, setContent2] = useState(initial.content2);
  const [content3, setContent3] = useState(initial.content3);


  // 리뷰 수정
  const updateMutation = useMutation({
    mutationFn: (payload: ReviewForm) => updateReview(payload, +articleId, reviewId),
    onSuccess: () => {
      // TODO: staleTime 고려
      alert("수정이 완료되었습니다.")
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

  // 삭제 뮤테이션
  const deleteMutation = useMutation({
    mutationFn: () => deleteReview(articleId, reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review", articleId, reviewId] });
      alert("리뷰가 삭제되었습니다.");
      setContent1("");
      setContent2("");
      setContent3("");
    },
  });

  const handleUpdateReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    const formData = new FormData(e.currentTarget);

    const content1 = formData.get("content1")?.toString();
    const content2 = formData.get("content2")?.toString();
    const content3 = formData.get("content3")?.toString();

    const parsed = ReviewSchema.safeParse({
      articleId: +articleId,
      reviewId: reviewId, 
      content1,
      content2,
      content3,
    });

    if (!parsed.success) {
      alert(parsed.error.issues[0].message);
      return;
    }

    updateMutation.mutate({ memberId, ...parsed.data});
  };

  const handleDeleteReview = () => {
    if (!confirm("정말 이 리뷰를 삭제하시겠습니까?")) return;
    deleteMutation.mutate();
  };

  return (
      <article className="flex flex-col gap-5 w-full mt-5 border p-3">
      <header>
        <h2 className="font-bold">기사 제목 : ABCDEFGHIJKLMNOPQRSTUVWXYZ</h2>
      </header>

      <form onSubmit={handleUpdateReview} className="flex flex-col gap-6 w-full">
        <div className="grid w-full gap-2">
          <Label htmlFor="content1">기사에 대한 내 생각</Label>
          <Textarea
            id="content1"
            name="content1"
            value={content1}
            onChange={(e) => setContent1(e.target.value)}
            className='resize-none h-40 w-full'
            placeholder="기사에 대한 내 생각을 입력해주세요"
          />
        </div>

        <div className="grid w-full gap-2">
          <Label htmlFor="content2">어려웠던 용어 정리</Label>
          <Textarea
            id="content2"
            name="content2"
            value={content2}
            onChange={(e) => setContent2(e.target.value)}
            className='resize-none h-40 w-full'
            placeholder="어려웠던 용어를 입력해주세요"
          />
        </div>

        <div className="grid w-full gap-2">
          <Label htmlFor="content3">개인적으로 더 공부한 내용</Label>
          <Textarea
            id="content3"
            name="content3"
            value={content3}
            onChange={(e) => setContent3(e.target.value)}
            className='resize-none h-40 w-full'
            placeholder="더 공부한 내용을 입력해주세요"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            type="submit" 
            disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "수정 중..." : "수정"}
          </Button>
        <Button 
            type="button" 
            onClick={handleDeleteReview}
            disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "삭제 중..." : "삭제"}
          </Button>
        </div>
      </form>
    </article>
  );
}

