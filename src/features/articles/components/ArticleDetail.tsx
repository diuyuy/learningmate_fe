import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { RiRobot2Line } from 'react-icons/ri';
import { FaRegBookmark } from 'react-icons/fa6';

export default function ArticleDetail() {
  return (
    <article className='flex flex-col gap-5 w-full mt-5'>
      <header className='mx-auto'>
        <div className='flex justify-center items-center bg-gray-300 w-[90vw] min-h-15 text-3xl font-extrabold'>
          Article Header
        </div>
      </header>
      <section className='flex w-full mt-10'>
        <div className='w-1/5'>
          <div className='flex flex-col items-center justify-center'>
            <Avatar className='w-25 h-25'>
              <AvatarImage src='https://github.com/shadcn.png' />
            </Avatar>
            <div className='mt-2 text-sm font-bold'>김현수 기자</div>
          </div>
        </div>
        <div className='w-3/5'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, eum
          minus. A provident aliquam nemo! Autem cum saepe odio, voluptatum
          porro iusto eos necessitatibus numquam consequuntur dolore minus,
          quaerat minima.
        </div>
        <div className='w-1/5'>
          <div className='flex gap-5 justify-center items-center'>
            <div>
              <RiRobot2Line className='text-3xl' />
            </div>
            <div>
              <FaRegBookmark className='text-3xl' />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
