import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { deleteReview, postReview, updateReview } from "../api/api";
import type { ReviewForm } from "../types/types";
import type { AxiosError } from "axios";
import { QUERY_KEYS } from "@/constants/querykeys";

function defaultOnError(error: unknown) {
  if ((error as AxiosError)?.isAxiosError) {
    const ax = error as AxiosError<{ message?: string }>;
    alert(ax.response?.data?.message ?? ax.message);
  } else if (error instanceof Error) {
    alert(error.message);
  } else {
    alert("알 수 없는 오류");
  }
}

export function useUpdateReviewMutation(
  articleId: number,
  reviewId: number,
  options?: UseMutationOptions<unknown, AxiosError, ReviewForm>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.REVIEW, "update", articleId, reviewId],
    mutationFn: (payload: ReviewForm) => updateReview(payload, articleId, reviewId),
    onSuccess: async (...args) => {
      alert("수정이 완료되었습니다.");
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEW, articleId, reviewId] });
      options?.onSuccess?.(...args);
    },
    onError: (err, ...rest) => {
      if (options?.onError) return options.onError(err, ...rest);
      defaultOnError(err);
    },
    ...options,
  });
}

export function useDeleteReviewMutation(
  articleId: number,
  reviewId: number,
  options?: UseMutationOptions<unknown, AxiosError, void>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.REVIEW, "delete", articleId, reviewId],
    mutationFn: () => deleteReview(articleId, reviewId),
    onSuccess: async (...args) => {
      alert("리뷰가 삭제되었습니다.");
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEW, articleId, reviewId] });
      options?.onSuccess?.(...args);
    },
    onError: (err, ...rest) => {
      if (options?.onError) return options.onError(err, ...rest);
      defaultOnError(err);
    },
    ...options,
  });
}

export function useCreateReviewMutation(
  articleId: number,
  options?: UseMutationOptions<unknown, AxiosError, ReviewForm>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEYS.REVIEW, "create", articleId],
    mutationFn: (payload: ReviewForm) => postReview(payload, articleId),
    onSuccess: async (...args) => {
      alert("작성이 완료되었습니다.");
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REVIEW, articleId] });
      options?.onSuccess?.(...args);
    },
    onError: (err, ...rest) => {
      if (options?.onError) return options.onError(err, ...rest);
      defaultOnError(err);
    },
    ...options,
  });
}