import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FaSearch } from 'react-icons/fa';

export default function TodaysKeywordCard({
  keywordName,
  keywordDesc,
}: {
  keywordName: string;
  keywordDesc: string;
}) {
  return (
    <Card className='w-[90vw] sm:w-full max-w-3xl mx-auto my-5 border-2 px-4 sm:px-6 lg:px-8'>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl sm:text-2xl font-extrabold flex gap-3 items-center justify-center'>
          <FaSearch />
          <div>오늘의 키워드</div>
        </CardTitle>
        <CardDescription>
          <div className='my-3 text-2xl sm:text-3xl font-extrabold text-primary'>
            {keywordName}
          </div>
          <div className='text-sm sm:text-md font-extrabold text-left'>
            {keywordDesc}
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
