import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ArticleCard() {
  return (
    <article className='w-full'>
      <Card className='flex flex-row min-h-10'>
        <figure className='flex-1/10'>
          <Avatar className='w-15 h-15 ml-5 rounded-lg'>
            <AvatarImage src='https://github.com/shadcn.png' />
          </Avatar>
        </figure>
        <section className='flex-9/10'>
          <CardHeader>
            <CardTitle className='text-2xl'>
              <h1>십센치, ‘더시즌즈’ 박보검 뒤 잇는다…MC 발탁</h1>
            </CardTitle>
            <CardDescription className='flex justify-between'>
              <h4>스포츠경향</h4>
              <h4>2일 전</h4>
            </CardDescription>
          </CardHeader>
        </section>
      </Card>
    </article>
  );
}
