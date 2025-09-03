import type { AxiosError } from "axios";
import { useReviewQuery } from "../hooks/useReviewQuery";
import ReviewUpdateForm from "./ReviewUpateForm";
import { useParams } from 'react-router';
import ReviewCreateFrom from "./ReviewCreateForm";
import { useSession } from "@/features/auth/context/useSession";

export default function ReviewForm() {
  const { articleId } = useParams();
  const  memberId = useSession();
  
  if (!articleId) {
    return <div>ArticleID Error</div>;
  }

  const { data, isPending, isError, error } = useReviewQuery(+articleId);

  if (isPending) return <div>로딩 중…</div>;

  if (isError) {
    const ax = error as AxiosError<any>;
    const msg = ax.response?.data?.message ?? ax.message ?? "알 수 없는 오류";
    return <div className="text-red-500">{msg}</div>;
  }

  return data ? (
  <ReviewUpdateForm articleId={+articleId} memberId={+memberId} initial={data} />
  ) : (
    <ReviewCreateFrom articleId={+articleId} memberId={+memberId} />
  );
};