import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateReviewMutation } from "../hooks/useReviewMutation";

type Props = {
  articleId: number;
  memberId: number;
};

const ReviewSchema = z.object({
  content1: z.string().min(10, "기사에 대한 내 생각을 최소 10자 이상 입력하세요.").max(2000, "2000자 이내로 입력하세요."),
  content2: z.string().min(10, "어려웠던 용어 정리를 최소 10자 이상 입력하세요.").max(2000, "2000자 이내로 입력하세요."),
  content3: z.string().min(10, "개인적으로 공부한 내용을 최소 10자 이상 입력하세요.").max(2000, "2000자 이내로 입력하세요."),
});

type FormValues = z.infer<typeof ReviewSchema>;

export default function ReviewCreateForm({ articleId, memberId }: Props) {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(ReviewSchema), 
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      content1: "",
      content2: "",
      content3: "",
    },
  });

  const createMutation = useCreateReviewMutation(articleId);

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
            maxLength={2000}
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
            maxLength={2000}
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
            maxLength={2000}
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