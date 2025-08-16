import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ReviewForm() {
  return (
    <article className='flex flex-col gap-5 w-full mt-5 border p-3'>
      <header>
        <h2 className='font-bold'>기사 제목 : ABCDEFGHIJKLMNOPQRSTUVWXYZ</h2>
      </header>

      <section className='flex flex-col gap-10 w-full'>
        <div className='grid w-full gap-3'>
          <Label htmlFor='thoughts'>
            <span>기사에 대한 내 생각</span>
            <span className='text-[10px]'>(300 / 1000)</span>
          </Label>
          <Textarea
            id='thoughts'
            placeholder='Type your message here.'
            className='resize-none h-40 w-full'
          />
        </div>

        <div className='grid w-full gap-3'>
          <Label htmlFor='terms'>
            <span>어려웠던 용어 정리</span>
            <span className='text-[10px]'>(300 / 1000)</span>
          </Label>
          <Textarea
            id='terms'
            placeholder='Type your message here.'
            className='resize-none h-40 w-full'
          />
        </div>

        <div className='grid w-full gap-3'>
          <Label htmlFor='study'>
            <span>개인적으로 더 공부한 내용</span>
            <span className='text-[10px]'>(300 / 1000)</span>
          </Label>
          <Textarea
            id='study'
            placeholder='Type your message here.'
            className='resize-none h-40 w-full'
          />
        </div>
        <div className='flex justify-end'>
          <Button className='w-full sm:w-auto'>작성</Button>
        </div>
      </section>
    </article>
  );
}
