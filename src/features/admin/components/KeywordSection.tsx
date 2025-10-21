import { Button } from '@/components/ui/button';
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
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type RowSelectionState,
  type Updater,
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useKeywordsQuery } from '../hooks/useKeywordsQuery';
import type { PaginationState } from '../types/types';
import { createKeywordColumns } from './createKeywordColumns';

type Props = {
  queryState: ReturnType<typeof useKeywordsQuery>;
  pagination: PaginationState;
  setPagination: (pagination: Updater<PaginationState>) => void;
  rowSelection: RowSelectionState;
  setRowSelection: (rowSelection: Updater<RowSelectionState>) => void;
  setKeyword: React.Dispatch<
    React.SetStateAction<KeywordWithVideo | undefined>
  >;
};

export default function KeywordSection({
  queryState,
  pagination,
  setPagination,
  rowSelection,
  setRowSelection,
  setKeyword,
}: Props) {
  const { isPending, isError, data } = queryState;
  const columns = useMemo(() => createKeywordColumns(), []);

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

  const handleClickNextPage = async () => {
    if (isPending) return;
    table.nextPage();
  };

  const handleClickPreviousPage = async () => {
    if (isPending) return;
    table.previousPage();
  };

  useEffect(() => {
    const keyword = table.getSelectedRowModel().rows.at(0)?.original;
    setKeyword(keyword);
  }, [rowSelection, keywords, setKeyword, table]);

  return (
    <section>
      <h2 className='text-2xl font-bold'>Keywords</h2>
      <div className='my-2 flex flex-col gap-3'>
        <div className='overflow-hidden border rounded-md'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className='font-semibold'>
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
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getAllCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className='max-w-[250px] truncate'
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
        <div className='flex gap-3'>
          <Button
            variant={'secondary'}
            onClick={handleClickPreviousPage}
            disabled={!data || data.page === 0 || isPending}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant={'secondary'}
            onClick={handleClickNextPage}
            disabled={!data?.hasNext || isPending}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </section>
  );
}
