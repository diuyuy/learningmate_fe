// my/api/myReviews.ts
import { api } from '@/lib/axios';
import type {
  ReviewListItem,
  ReviewListPageResponse,
} from '@/features/reviews/types/types';

export type MyReviewsParams = {
  page?: number; // 0-base (Spring 기본)
  size?: number;
  sort?: 'latest' | 'liked'; // UI용 키
};

const DEFAULT_SIZE = 10;

// { result } | { data } | 직접 페이지 형태 대응
function unwrapPage(data: any): ReviewListPageResponse {
  const page = data?.result ?? data?.data ?? data;
  if (!page || !Array.isArray(page.items)) {
    console.warn('Unexpected my-reviews page shape:', data);
  }
  return page as ReviewListPageResponse;
}

// UI sort → 서버 sort 파라미터(Spring Pageable)
function toServerSort(s?: MyReviewsParams['sort']) {
  if (!s) return undefined;
  if (s === 'latest') return 'createdAt,desc';
  if (s === 'liked') return 'likeCount,desc';
  return undefined;
}

export async function fetchMyReviews(
  params: MyReviewsParams = {}
): Promise<ReviewListPageResponse> {
  const page = Number.isFinite(params.page) ? (params.page as number) : 0;
  const size = Number.isFinite(params.size)
    ? (params.size as number)
    : DEFAULT_SIZE;
  const sortParam = toServerSort(params.sort);

  const query: Record<string, any> = { page, size };
  if (sortParam) query.sort = sortParam; // ❗️예: sort=createdAt,desc

  const res = await api.get('/reviews/me', { params: query });
  const pageData = unwrapPage(res.data);
  const items: ReviewListItem[] = Array.isArray((pageData as any).items)
    ? (pageData as any).items
    : [];
  return { ...pageData, items };
}
