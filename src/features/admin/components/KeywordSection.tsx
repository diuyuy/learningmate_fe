import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { KeywordWithVideo } from '@/features/keywords/types/types';
import { debounce } from '@/lib/utils';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SearchIcon,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react';
import { useSearchParams } from 'react-router';
import { useKeywordsQuery } from '../hooks/useKeywordsQuery';
import { useWindowSize } from '../hooks/useWindowSize';
import { useKeywordTableStore } from '../store/keywordTableStore';
import { createKeywordColumns } from './createKeywordColumns';
import KeywordDetailDialog from './KeywordDetailDialog';
import KeywordFilterDropdown from './KeywordFilterDropdown';
import KeywordSortDropdown from './KeywordSortDropdown';

// 10개씩 묶어서 페이지 번호 생성
const generatePageNumbers = (currentPage: number, totalPages: number) => {
  const pages: number[] = [];
  const pagesPerBlock = 10;

  // 현재 페이지가 속한 블록의 시작 인덱스 계산
  const blockStart = Math.floor(currentPage / pagesPerBlock) * pagesPerBlock;
  const blockEnd = Math.min(blockStart + pagesPerBlock, totalPages);

  for (let i = blockStart; i < blockEnd; i++) {
    pages.push(i);
  }

  return pages;
};

const PAGE_SIZE = 10;

export default function KeywordSection() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Zustand store에서 상태 가져오기
  const pagination = useKeywordTableStore((state) => state.pagination);
  const setPagination = useKeywordTableStore((state) => state.setPagination);
  const rowSelection = useKeywordTableStore((state) => state.rowSelection);
  const setRowSelection = useKeywordTableStore(
    (state) => state.setRowSelection
  );
  const filteringQuery = useKeywordTableStore((state) => state.filteringQuery);
  const setFilteringQuery = useKeywordTableStore(
    (state) => state.setFilteringQuery
  );
  const filteringCategory = useKeywordTableStore(
    (state) => state.filteringCategory
  );
  const sortOrder = useKeywordTableStore((state) => state.sortOrder);
  const setKeyword = useKeywordTableStore((state) => state.setKeyword);

  // Query 호출
  const { isPending, isError, data } = useKeywordsQuery(
    pagination.pageIndex,
    filteringQuery,
    filteringCategory,
    sortOrder
  );

  const [selectedKeyword, setSelectedKeyword] =
    useState<KeywordWithVideo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetail = (keyword: KeywordWithVideo) => {
    setSelectedKeyword(keyword);
    setIsDialogOpen(true);
  };

  const handleQueryChange = useCallback(
    debounce((e: ChangeEvent<HTMLInputElement>) =>
      setFilteringQuery(e.target.value)
    ),
    [setFilteringQuery]
  );

  const { width } = useWindowSize();

  const columns = useMemo(
    () => createKeywordColumns(handleViewDetail, width),
    [width]
  );

  const keywords = data?.items ?? [];

  const table = useReactTable({
    data: keywords,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.totalPages ?? -1,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination,
      rowSelection,
    },
  });

  const handleClickFirstPage = () => {
    if (isPending) return;
    table.setPageIndex(0);
  };

  const handleClickLastPage = () => {
    if (isPending || !data) return;
    table.setPageIndex(data.totalPages - 1);
  };

  const handleClickPage = (pageIndex: number) => {
    if (isPending) return;
    table.setPageIndex(pageIndex);
  };

  const handleClickPrevBlock = () => {
    if (isPending) return;
    const pagesPerBlock = 10;
    const currentBlockStart =
      Math.floor(pagination.pageIndex / pagesPerBlock) * pagesPerBlock;
    const prevBlockStart = Math.max(0, currentBlockStart - pagesPerBlock);
    table.setPageIndex(prevBlockStart);
  };

  const handleClickNextBlock = () => {
    if (isPending || !data) return;
    const pagesPerBlock = 10;
    const currentBlockStart =
      Math.floor(pagination.pageIndex / pagesPerBlock) * pagesPerBlock;
    const nextBlockStart = Math.min(
      currentBlockStart + pagesPerBlock,
      data.totalPages - 1
    );
    table.setPageIndex(nextBlockStart);
  };

  const pageNumbers = useMemo(() => {
    if (!data) return [];
    return generatePageNumbers(pagination.pageIndex, data.totalPages);
  }, [pagination.pageIndex, data]);

  const isFirstBlock = pagination.pageIndex < 10;
  const isLastBlock =
    data &&
    Math.floor(pagination.pageIndex / 10) ===
      Math.floor((data.totalPages - 1) / 10);

  useEffect(() => {
    setRowSelection({
      [String((Number(searchParams.get('keywordId') ?? '0') % PAGE_SIZE) - 1)]:
        true,
    });
  }, []);

  useEffect(() => {
    const keyword = table.getSelectedRowModel().rows.at(0)?.original;
    setKeyword(keyword);

    // Update searchParams when a keyword is selected
    if (keyword) {
      setSearchParams({ keywordId: String(keyword.id) });
    }
  }, [rowSelection, keywords, setKeyword, table, setSearchParams]);

  return (
    <section>
      <h2 className='text-2xl font-bold'>Keywords</h2>
      <div className='my-2 flex flex-col gap-3'>
        <div className='flex justify-between items-end'>
          <div className='space-y-3'>
            <Label htmlFor='input-query' className='mt-3 font-semibold'>
              키워드 검색:
            </Label>
            <div className='relative max-w-80'>
              <Input id='input-query' onChange={handleQueryChange} />
              <SearchIcon
                color='gray'
                className='absolute right-2 top-1/2 -translate-y-1/2 size-4'
              />
            </div>
          </div>
          <div className='flex gap-3'>
            <KeywordSortDropdown />
            <KeywordFilterDropdown />
          </div>
        </div>
        <div className='overflow-hidden border rounded-md'>
          <Table className='table-fixed'>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className='font-semibold'
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isPending ? (
                <>
                  {Array.from({ length: pagination.pageSize }).map(
                    (_, index) => {
                      return (
                        <TableRow key={`empty-${index}`}>
                          <TableCell>
                            <Skeleton className='h-4' />
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='text-center py-8'
                  >
                    예상치 못한 오류가 발생했습니다.
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='text-center py-8'
                  >
                    일치하는 항목이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getAllCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className='flex gap-1 items-center justify-center flex-wrap'>
          <Button
            variant={'outline'}
            size={'icon'}
            onClick={handleClickFirstPage}
            disabled={!data || pagination.pageIndex === 0 || isPending}
            aria-label='첫 페이지'
          >
            <ChevronsLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant={'outline'}
            size={'icon'}
            onClick={handleClickPrevBlock}
            disabled={!data || isFirstBlock || isPending}
            aria-label='이전 10페이지'
          >
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>

          {pageNumbers.map((pageNum) => {
            const isCurrentPage = pageNum === pagination.pageIndex;

            return (
              <Button
                key={pageNum}
                variant={isCurrentPage ? 'default' : 'outline'}
                size={'icon'}
                onClick={() => handleClickPage(pageNum)}
                disabled={isPending}
                aria-label={`페이지 ${pageNum + 1}`}
                aria-current={isCurrentPage ? 'page' : undefined}
                className='min-w-10'
              >
                {pageNum + 1}
              </Button>
            );
          })}

          <Button
            variant={'outline'}
            size={'icon'}
            onClick={handleClickNextBlock}
            disabled={!data || isLastBlock || isPending}
            aria-label='다음 10페이지'
          >
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant={'outline'}
            size={'icon'}
            onClick={handleClickLastPage}
            disabled={
              !data || pagination.pageIndex === data.totalPages - 1 || isPending
            }
            aria-label='마지막 페이지'
          >
            <ChevronsRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
      {selectedKeyword && (
        <KeywordDetailDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          keyword={selectedKeyword}
        />
      )}
    </section>
  );
}
