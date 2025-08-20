import { Label } from "@radix-ui/react-label";
import type { ReviewForm, ReviewResponse } from "../types/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReview, updateReview } from "../api/api";
import { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

type Props = {
  articleId: number;
  memberId: number;
  initial: ReviewResponse;
};

const ReviewSchema = z.object({
  articleId: z.number().int().positive(),
  reviewId: z.number().int().positive(),
  content1: z.string().min(10, "기사에 대한 내 생각을 최소 10자 이상 입력하세요.").max(2000),
  content2: z.string().min(10, "어려웠던 용어 정리를 최소 10자 이상 입력하세요.").max(2000),
  content3: z.string().min(10, "개인적으로 공부한 내용을 최소 10자 이상 입력하세요.").max(2000),
});

type FormValues = z.infer<typeof ReviewSchema>;

export default function ReviewUpdateForm({ articleId, memberId, initial }: Props) {
  const queryClient = useQueryClient();
  const reviewId = initial.id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      articleId,
      reviewId,
      content1: initial.content1,
      content2: initial.content2,
      content3: initial.content3,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: ReviewForm) => updateReview(payload, articleId, reviewId),
    onSuccess: () => {
      alert("수정이 완료되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["review", articleId, memberId] });
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        alert(error.response?.data?.message ?? error.message);
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("알 수 없는 오류");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteReview(articleId, reviewId),
    onSuccess: () => {
      alert("리뷰가 삭제되었습니다.");
      reset({
        articleId,
        reviewId,
        content1: "",
        content2: "",
        content3: "",
      });
      queryClient.invalidateQueries({ queryKey: ["review", articleId, memberId] });
    },
  });

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate({ memberId, ...data });
  };

  return (
    <article className="flex flex-col gap-5 w-full mt-5 border p-3">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
        <div className="grid w-full gap-2">
          <Label htmlFor="content1">기사에 대한 내 생각</Label>
          <Textarea
            id="content1"
            {...register("content1")}
            className="resize-none h-40 w-full"
            placeholder="기사에 대한 내 생각을 입력해주세요"
          />
          {errors.content1 && <p className="text-red-500">{errors.content1.message}</p>}
        </div>

        <div className="grid w-full gap-2">
          <Label htmlFor="content2">어려웠던 용어 정리</Label>
          <Textarea
            id="content2"
            {...register("content2")}
            className="resize-none h-40 w-full"
            placeholder="어려웠던 용어를 입력해주세요"
          />
          {errors.content2 && <p className="text-red-500">{errors.content2.message}</p>}
        </div>

        <div className="grid w-full gap-2">
          <Label htmlFor="content3">개인적으로 더 공부한 내용</Label>
          <Textarea
            id="content3"
            {...register("content3")}
            className="resize-none h-40 w-full"
            placeholder="더 공부한 내용을 입력해주세요"
          />
          {errors.content3 && <p className="text-red-500">{errors.content3.message}</p>}
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "수정 중..." : "수정"}
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (confirm("정말 삭제하시겠습니까?")) deleteMutation.mutate();
            }}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "삭제 중..." : "삭제"}
          </Button>
        </div>
      </form>
    </article>
  );
}
