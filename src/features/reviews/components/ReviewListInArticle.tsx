import { useInfiniteArticleReviews } from '../hooks/useInfiniteReviewsQuery';
import ReviewList from './ReviewList';

type Props = {
  articleId: number;
  title?: string;
};

export default function ReviewListInArticle({ articleId, title }: Props) {
  const query = useInfiniteArticleReviews(articleId);
  return <ReviewList query={query} title='기사 리뷰 목록' />;
}
