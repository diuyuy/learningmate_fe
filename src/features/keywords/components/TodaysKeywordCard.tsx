import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FaSearch } from 'react-icons/fa';

export default function TodaysKeywordCard() {
  return (
    <Card className='min-w-125 my-5 border-2'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-extrabold flex gap-3 items-center justify-center'>
          <FaSearch />
          <span>오늘의 키워드</span>
        </CardTitle>
        <CardDescription className='my-3 text-5xl font-extrabold text-primary'>
          "주식"
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
