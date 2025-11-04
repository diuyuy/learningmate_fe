import { api } from '@/lib/axios';
import type { ScrapPage } from '@/features/my/types/scraps';

// ✅ UI 정렬 키
export type MyScrapSort = 'latest' | 'popular';

// 안전 언래핑: {result:{...}} | {data:{...}} | 직접
function unwrapPage(data: any): ScrapPage {
  const page = data?.result ?? data?.data ?? data;
  return page as ScrapPage;
}

// ✅ UI sort → 서버 sort 파라미터(Spring Pageable)
function toServerSort(sort?: MyScrapSort) {
  switch (sort) {
    case 'latest':
      // 공개/발행일 기준 정렬(필드명이 다르면 createdAt/updatedAt로 변경)
      return 'createdAt,desc';
    case 'popular':
      // 스크랩 많은 순
      return 'scrapCounts,desc';
    default:
      return undefined;
  }
}

/** 내 스크랩 목록 */
export async function fetchMyScraps(
  page = 0,
  size = 12,
  sort: MyScrapSort = 'latest'
): Promise<ScrapPage> {
  const params: Record<string, any> = { page, size };
  const sortParam = toServerSort(sort);
  if (sortParam) params.sort = sortParam;

  const res = await api.get('/members/me/article-scraps', { params });
  return unwrapPage(res.data);
}

// ✅ 토글 API는 단일 출처(articles)에서 재노출
export {
  postArticleScrap,
  deleteArticleScrap,
} from '@/features/articles/api/api';
