import { useInfiniteKeywordReviews } from '@/features/reviews/hooks/useInfiniteReviewsQuery';
import ReviewList from './ReviewList';
import type { QueryKey } from '@tanstack/react-query';

export default function KeywordReviewList({
  keywordId,
  title,
}: {
  keywordId: number;
  title?: string;
}) {
  const query = useInfiniteKeywordReviews(keywordId);
  const queryKey: QueryKey = ['reviews', 'keyword', keywordId];

  return (
    <ReviewList
      title={title ?? '최신 리뷰'}
      query={query}
      queryKey={queryKey}
    />
  );
}
