import { Button } from '@/components/ui/button';
import KeywordSection from '@/features/admin/components/KeywordSection';
import VideoSection from '@/features/admin/components/VideoSecion';
import { useKeywordsQuery } from '@/features/admin/hooks/useKeywordsQuery';
import type {
  KeywordWithVideo,
  TodaysKeyword,
} from '@/features/keywords/types/types';
import type { RowSelectionState } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useLoaderData } from 'react-router';

const PAGE_SIZE = 10;

export default function AdminPage() {
  const todaysKeyword = useLoaderData<TodaysKeyword>();
  const todaysKeywordId = todaysKeyword.id;
  const initialIdx = Math.trunc(todaysKeywordId / PAGE_SIZE);

  const [pagination, setPagination] = useState({
    pageIndex: initialIdx,
    pageSize: PAGE_SIZE,
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({
    [String(initialIdx)]: true,
  });

  const [keyword, setKeyword] = useState<KeywordWithVideo>();

  const queryState = useKeywordsQuery(pagination.pageIndex);

  return (
    <main className='flex flex-col gap-16 mx-16  max-w-7xl lg:mx-auto '>
      <h1 className='text-3xl font-bold'>Admin Page</h1>
      <KeywordSection
        queryState={queryState}
        pagination={pagination}
        rowSelection={rowSelection}
        setPagination={setPagination}
        setRowSelection={setRowSelection}
        setKeyword={setKeyword}
      />

      <VideoSection videoUrl={keyword?.video?.link} />
      <section>
        <div className='flex justify-between'>
          <h2 className='text-2xl font-bold'>Articles</h2>
          <Button variant={'secondary'} className='font-semibold'>
            <PlusIcon /> Add new Article
          </Button>
        </div>
        <ul>
          <li>list1</li>
          <li>list2</li>
          <li>list3</li>
          <li>list4</li>
          <li>list5</li>
        </ul>
      </section>
    </main>
  );
}
