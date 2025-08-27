function patchOne<T extends object>(
  item: T,
  reviewId: number,
  nextLiked: boolean
): T {
  const r: any = item;
  if (!r || r.id !== reviewId) return item;

  const prevLiked = Boolean(r.likedByMe);
  if (prevLiked === nextLiked) return item;

  const prevCount = typeof r.likeCount === 'number' ? r.likeCount : 0;
  const delta = nextLiked ? +1 : -1;
  const nextCount = Math.max(0, prevCount + delta);

  return {
    ...r,
    likedByMe: nextLiked,
    likeCount: nextCount,
  } as T;
}

function patchList<T extends object>(
  list: T[] | undefined,
  reviewId: number,
  nextLiked: boolean
) {
  return Array.isArray(list)
    ? list.map((x) => patchOne(x, reviewId, nextLiked))
    : list;
}

function patchPage<T extends object>(
  page: T,
  reviewId: number,
  nextLiked: boolean
): T {
  const p: any = page;
  if (Array.isArray(p?.items)) {
    return { ...p, items: patchList(p.items, reviewId, nextLiked) };
  }
  if (Array.isArray(p?.content)) {
    return { ...p, content: patchList(p.content, reviewId, nextLiked) };
  }
  return page;
}

export function patchLikeInCache<T>(
  data: T,
  id: number,
  nextLiked: boolean
): T {
  const d: any = data;
  if (!d) return data;

  if (Array.isArray(d?.pages)) {
    return {
      ...d,
      pages: d.pages.map((pg: any) => patchPage(pg, id, nextLiked)),
    };
  }

  if (Array.isArray(d?.items) || Array.isArray(d?.content)) {
    return patchPage(d, id, nextLiked) as T;
  }

  if (Array.isArray(d)) {
    return patchList(d, id, nextLiked) as T;
  }

  if (typeof d === 'object' && d !== null && 'id' in d) {
    return patchOne(d, id, nextLiked) as T;
  }

  return data;
}
