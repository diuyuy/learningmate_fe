import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ReviewForm() {
  return (
    <article className='flex flex-col gap-5 w-full mt-5 border p-3'>
      <header>
        <h2 className='font-bold'>기사 제목 : ABCDEFGHIJKLMNOPQRSTUVWXYZ</h2>
      </header>
      <section className='flex flex-col gap-10'>
        <div className='grid w-full gap-3'>
          <Label htmlFor='message'>
            <span>기사에 대한 내 생각</span>
            <span className='text-[10px]'>(300 / 1000)</span>
          </Label>
          <Textarea
            placeholder='Type your message here.'
            id='message'
            rows={20}
            cols={70}
            className='resize-none h-40'
          />
        </div>
        <div className='grid w-full gap-3'>
          <Label htmlFor='message'>
            <span>어려웠던 용어 정리</span>
            <span className='text-[10px]'>(300 / 1000)</span>
          </Label>
          <Textarea
            placeholder='Type your message here.'
            id='message'
            rows={20}
            cols={70}
            className='resize-none h-40'
          />
        </div>
        <div className='grid w-full gap-3'>
          <Label htmlFor='message'>
            <span>개인적으로 더 공부한 내용</span>{' '}
            <span className='text-[10px]'>(300 / 1000)</span>
          </Label>
          <Textarea
            placeholder='Type your message here.'
            id='message'
            rows={20}
            cols={70}
            className='resize-none h-40'
          />
        </div>
        <div className='flex justify-end'>
          <Button>작성</Button>
        </div>
      </section>
    </article>
  );
}
