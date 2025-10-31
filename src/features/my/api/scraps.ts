import { api } from '@/lib/axios';
import type { ScrapPage } from '@/features/my/types/scraps';

// 안전 언래핑: {result:{...}} | {data:{...}} | 직접
function unwrapPage(data: any): ScrapPage {
  const page = data?.result ?? data?.data ?? data;
  return page as ScrapPage;
}

/** 내 스크랩 목록 */
export async function fetchMyScraps(page = 0, size = 12): Promise<ScrapPage> {
  const res = await api.get('/members/me/article-scraps', {
    params: { page, size },
  });
  return unwrapPage(res.data);
}

// ✅ 토글 API는 단일 출처(articles)에서 재노출
export {
  postArticleScrap,
  deleteArticleScrap,
} from '@/features/articles/api/api';
