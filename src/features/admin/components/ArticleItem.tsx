import { Button } from '@/components/ui/button';
import { ROUTE_PATHS } from '@/constants/routepaths';
import { PencilIcon } from 'lucide-react';
import { Link } from 'react-router';

type Props = {
  articleId: number;
  title: string;
  keywordId: number;
};

export default function ArticleItem({ articleId, title, keywordId }: Props) {
  return (
    <div className='flex justify-between items-center'>
      <span className=''>{title}</span>
      <div className='flex gap-3'>
        <Button variant={'ghost'} asChild>
          <Link to={ROUTE_PATHS.EDIT_ARTICLE(keywordId, articleId)}>
            <PencilIcon />
          </Link>
        </Button>
      </div>
    </div>
  );
}
