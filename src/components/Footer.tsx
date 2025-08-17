import { BookOpen, Home, User } from 'lucide-react';
import { Separator } from './ui/separator';
import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className='px-6 py-6 flex flex-col gap-6 bg-muted/40 container mx-auto'>
      <article className='flex flex-col md:flex-row items-center md:items-center justify-between gap-4'>
        <figure className='text-3xl font-bold text-primary my-3'>
          LearningMate
        </figure>

        <section className='flex gap-6 text-sm text-muted-foreground'>
          <Link
            to='/'
            className='flex items-center gap-1 hover:text-primary transition'
          >
            <Home className='w-4 h-4' /> 홈
          </Link>
          <Link
            to='/learning'
            className='flex items-center gap-1 hover:text-primary transition'
          >
            <BookOpen className='w-4 h-4' /> 오늘의 스터디
          </Link>
          <Link
            to='/my'
            className='flex items-center gap-1 hover:text-primary transition'
          >
            <User className='w-4 h-4' /> 마이페이지
          </Link>
        </section>
      </article>

      <Separator />

      <aside className='flex flex-col md:flex-row items-center justify-end gap-3 text-xs text-muted-foreground'>
        <p>&copy; 2025 LearningMate. All rights reserved.</p>
      </aside>
    </footer>
  );
}
