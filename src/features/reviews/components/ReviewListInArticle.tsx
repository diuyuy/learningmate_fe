import { useInfiniteArticleReviews } from '@/features/reviews/hooks/useInfiniteReviewsQuery';
import ReviewList from './ReviewList';
import type { QueryKey } from '@tanstack/react-query';

type Props = {
  articleId: number;
  title?: string;
};

export default function ReviewListInArticle({ articleId, title }: Props) {
  const query = useInfiniteArticleReviews(articleId);
  const queryKey: QueryKey = ['reviews', 'article', articleId];

  return (
    <ReviewList
      query={query}
      title={title ?? '리뷰 목록'}
      queryKey={queryKey}
    />
  );
}
