import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { postReview } from "../api/api";
import type { ReviewForm } from "../types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";

type Props = {
  articleId: number;
  memberId: number;
};

const ReviewSchema = z.object({
  articleId: z.number().int().positive(),
  content1: z.string().trim().min(10, "기사에 대한 내 생각을 최소 10자 이상 입력하세요.").max(2000, "2000자 이내로 입력하세요."),
  content2: z.string().trim().min(10, "어려웠던 용어 정리를 최소 10자 이상 입력하세요.").max(2000, "2000자 이내로 입력하세요."),
  content3: z.string().trim().min(10, "개인적으로 공부한 내용을 최소 10자 이상 입력하세요.").max(2000, "2000자 이내로 입력하세요."),
});

type FormValues = z.infer<typeof ReviewSchema>;

export default function ReviewCreateFrom({ articleId, memberId }: Props) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(ReviewSchema), // Zod 스키마를 유효성 검사기로 사용
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      articleId,
      content1: "",
      content2: "",
      content3: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: ReviewForm) => postReview(payload, +articleId),
    onSuccess: () => {
      alert("작성이 완료되었습니다.");
      // 리뷰 쿼리 무효화하여 최신 데이터를 다시 불러옴
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

  // handleSubmit이 유효성 검사를 통과시킨 데이터로 mutate 함수를 호출합니다.
  const onSubmit = (data: FormValues) => {
    createMutation.mutate({ memberId, ...data });
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
          {errors.content1 && <p className="text-sm text-red-500">{errors.content1.message}</p>}
        </div>

        <div className="grid w-full gap-2">
          <Label htmlFor="content2">어려웠던 용어 정리</Label>
          <Textarea
            id="content2"
            {...register("content2")}
            className="resize-none h-40 w-full"
            placeholder="어려웠던 용어를 입력해주세요"
          />
          {errors.content2 && <p className="text-sm text-red-500">{errors.content2.message}</p>}
        </div>

        <div className="grid w-full gap-2">
          <Label htmlFor="content3">개인적으로 더 공부한 내용</Label>
          <Textarea
            id="content3"
            {...register("content3")}
            className="resize-none h-40 w-full"
            placeholder="더 공부한 내용을 입력해주세요"
          />
          {errors.content3 && <p className="text-sm text-red-500">{errors.content3.message}</p>}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "작성 중..." : "작성"}
          </Button>
        </div>
      </form>
    </article>
  );
}