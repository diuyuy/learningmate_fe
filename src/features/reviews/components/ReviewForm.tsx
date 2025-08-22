import type { AxiosError } from "axios";
import { useReviewQuery } from "../hooks/useReviewQuery";
import ReviewUpdateForm from "./ReviewUpateForm";
import { useParams } from 'react-router';
import ReviewCreateFrom from "./ReviewCreateForm";

export default function ReviewForm() {
  // TODO : 로그인 구현 후 수정
  const memberId = 10;
  const { articleId } = useParams();
  
  if (!articleId) {
    return <div>ArticleID Error</div>;
  }

  const { data, isPending, isError, error } = useReviewQuery(+articleId, memberId);

  if (isPending) return <div>로딩 중…</div>;

  if (isError) {
    const ax = error as AxiosError<any>;
    const msg = ax.response?.data?.message ?? ax.message ?? "알 수 없는 오류";
    return <div className="text-red-500">{msg}</div>;
  }

  return data ? (
  <ReviewUpdateForm articleId={+articleId} memberId={memberId} initial={data} />
  ) : (
    <ReviewCreateFrom articleId={+articleId} memberId={memberId} />
  );
};