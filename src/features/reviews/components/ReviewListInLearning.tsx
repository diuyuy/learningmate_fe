import { useInfiniteKeywordReviews } from '../hooks/useInfiniteReviewsQuery';
import ReviewList from './ReviewList';

export default function KeywordReviewList({
  keywordId,
  title,
}: {
  keywordId: number;
  title?: string;
}) {
  const query = useInfiniteKeywordReviews(keywordId);
  return <ReviewList title={title} query={query} />;
}
