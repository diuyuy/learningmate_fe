import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { FaRegBookmark } from 'react-icons/fa6';
import { RiRobot2Line } from 'react-icons/ri';
import { useParams } from 'react-router';
import { useArticleQuery } from '../hooks/useArticleQuery';
import { ArticleModal } from './ArticleModal';

export default function ArticleDetail() {
  const { articleId } = useParams();

  if (!articleId) {
    return <div>ArticleID Error</div>;
  }

  const {
    isPending,
    isError,
    data: article,
    error,
  } = useArticleQuery(+articleId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isError) {
    return <div>에러가 발생했습니다...{error.message}</div>;
  }

  if (isPending) {
    return <div />;
  }

  return (
    <article className='flex flex-col gap-5 w-full mt-5'>
      <header className='mx-auto w-full px-5 md:w-2/3'>
        <div className='flex justify-center items-center bg-gray-300 min-h-15 text-xl md:text-2xl font-extrabold'>
          {article.title}
        </div>
      </header>

      <section className='flex flex-wrap justify-between md:flex-nowrap w-full mt-10 px-5 gap-3'>
        <div className='w-1/3 md:w-1/5 flex justify-start order-1 md:order-none'>
          <div className='flex flex-col justify-start items-center'>
            <Avatar className='w-20 h-20 md:w-25 md:h-25'>
              <AvatarImage src='https://github.com/shadcn.png' /> //TODO: 링크
              적용
            </Avatar>
            <div className='mt-2 text-sm font-bold'>{article.reporter}</div>
          </div>
        </div>

        <div className='w-full order-3 md:order-none'>
          <p>{article.content}</p>
        </div>
        <div className='w-1/3 md:w-1/5 flex gap-5 justify-end items-start mt-3 md:mt-0 order-2 md:order-none'>
          <div>
            <RiRobot2Line
              className='text-3xl cursor-pointer'
              onClick={() => setIsModalOpen(true)}
            />
          </div>
          <div>
            <FaRegBookmark className='text-3xl' />
          </div>
        </div>
      </section>

      <div className='w-full px-2'>
        <ArticleModal
          summary={article.summary}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </article>
  );
}
