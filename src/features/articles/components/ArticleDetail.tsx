import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { RiRobot2Line } from 'react-icons/ri';
import { FaRegBookmark } from 'react-icons/fa6';
import { useState } from 'react';
import { ArticleModal } from './ArticleModal';

export default function ArticleDetail() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <article className='flex flex-col gap-5 w-full mt-5'>
      <header className='mx-auto w-2/3'>
        <div className='flex justify-center items-center bg-gray-300 min-h-15 text-3xl font-extrabold'>
          Article Header
        </div>
      </header>

      <section className='flex flex-col md:flex-row w-full mt-10 gap-5'>
        <div className='w-full md:w-1/5 flex flex-col items-center justify-start'>
          <Avatar className='w-20 h-20 md:w-25 md:h-25'>
            <AvatarImage src='https://github.com/shadcn.png' />
          </Avatar>
          <div className='mt-2 text-sm font-bold'>김현수 기자</div>
        </div>

        <div className='w-full px-5'>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat,
            eum minus. A provident aliquam nemo! Autem cum saepe odio,
            voluptatum porro iusto eos necessitatibus numquam consequuntur
            dolore minus, quaerat minima.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat,
            eum minus. A provident aliquam nemo! Autem cum saepe odio,
            voluptatum porro iusto eos necessitatibus numquam consequuntur
            dolore minus, quaerat minima.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat,
            eum minus. A provident aliquam nemo! Autem cum saepe odio,
            voluptatum porro iusto eos necessitatibus numquam consequuntur
            dolore minus, quaerat minima.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat,
            eum minus. A provident aliquam nemo! Autem cum saepe odio,
            voluptatum porro iusto eos necessitatibus numquam consequuntur
            dolore minus, quaerat minima.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat,
            eum minus. A provident aliquam nemo! Autem cum saepe odio,
            voluptatum porro iusto eos necessitatibus numquam consequuntur
            dolore minus, quaerat minima.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat,
            eum minus. A provident aliquam nemo! Autem cum saepe odio,
            voluptatum porro iusto eos necessitatibus numquam consequuntur
            dolore minus, quaerat minima.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat,
            eum minus. A provident aliquam nemo! Autem cum saepe odio,
            voluptatum porro iusto eos necessitatibus numquam consequuntur
            dolore minus, quaerat minima.
          </p>
        </div>
        <div className='w-full md:w-1/5 flex gap-5 justify-center items-start mt-3 md:mt-0'>
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
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </article>
  );
}
