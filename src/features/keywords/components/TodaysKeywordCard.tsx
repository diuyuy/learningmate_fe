import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FaSearch } from 'react-icons/fa';

export default function TodaysKeywordCard() {
  return (
    <Card className='w-[90vw] sm:w-full max-w-3xl mx-auto my-5 border-2 px-4 sm:px-6 lg:px-8'>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl sm:text-2xl font-extrabold flex gap-3 items-center justify-center'>
          <FaSearch />
          <span>오늘의 키워드</span>
        </CardTitle>
        <CardDescription className='my-3 text-4xl sm:text-5xl font-extrabold text-primary'>
          <span>주식</span>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
