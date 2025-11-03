import ArticleSection from '@/features/admin/components/ArticleSection';
import KeywordSection from '@/features/admin/components/KeywordSection';
import VideoSection from '@/features/admin/components/VideoSecion';
import { useKeywordsQuery } from '@/features/admin/hooks/useKeywordsQuery';
import type { KeywordWithVideo } from '@/features/keywords/types/types';
import type { RowSelectionState } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

const PAGE_SIZE = 10;

export default function AdminPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const keywordId = searchParams.get('keywordId') ?? '1';
  const [filteringQuery, setFilteringQuery] = useState('');

  const initialPageIdx =
    filteringQuery === '' ? 0 : Math.trunc(Number(keywordId) / PAGE_SIZE);

  const [pagination, setPagination] = useState({
    pageIndex: initialPageIdx,
    pageSize: PAGE_SIZE,
  });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({
    [filteringQuery === '' ? String((Number(keywordId) % PAGE_SIZE) - 1) : '0']:
      true,
  });

  const [keyword, setKeyword] = useState<KeywordWithVideo>();

  const queryState = useKeywordsQuery(pagination.pageIndex, filteringQuery);

  useEffect(() => {
    if (filteringQuery !== '') setRowSelection({ '0': true });
  }, [filteringQuery, setRowSelection]);

  return (
    <main className='flex flex-col gap-20 mx-4  max-w-7xl lg:mx-auto '>
      <h1 className='text-3xl font-bold'>Admin Page</h1>
      <KeywordSection
        queryState={queryState}
        pagination={pagination}
        rowSelection={rowSelection}
        setPagination={setPagination}
        setRowSelection={setRowSelection}
        setKeyword={setKeyword}
        setSearchParams={setSearchParams}
        setFilteringQuery={setFilteringQuery}
      />

      {keyword && <VideoSection keywordId={keyword.id} video={keyword.video} />}
      {keyword && <ArticleSection keywordId={keyword.id} />}
    </main>
  );
}
