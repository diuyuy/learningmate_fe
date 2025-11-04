import type { KeywordWithVideo } from '@/features/keywords/types/types';
import type { KeywordCategory } from '@/types/types';
import type { RowSelectionState, Updater } from '@tanstack/react-table';
import { create } from 'zustand';
import type { PaginationState } from '../types/types';

type SortOrder = 'asc' | 'desc';

type State = {
  pagination: PaginationState;
  rowSelection: RowSelectionState;
  filteringQuery: string;
  filteringCategory: KeywordCategory | null;
  sortOrder: SortOrder;
  keyword: KeywordWithVideo | undefined;
};

type Actions = {
  setPagination: (updater: Updater<PaginationState>) => void;
  setRowSelection: (updater: Updater<RowSelectionState>) => void;
  setFilteringQuery: (query: string) => void;
  setFilteringCategory: (category: KeywordCategory | null) => void;
  setSortOrder: (order: SortOrder) => void;
  setKeyword: (keyword: KeywordWithVideo | undefined) => void;
  reset: () => void;
};

const initialState: State = {
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  rowSelection: {},
  filteringQuery: '',
  filteringCategory: null,
  sortOrder: 'asc',
  keyword: undefined,
};

export const useKeywordTableStore = create<State & Actions>((set) => ({
  ...initialState,

  setPagination: (updater) =>
    set((state) => ({
      pagination:
        typeof updater === 'function' ? updater(state.pagination) : updater,
    })),

  setRowSelection: (updater) =>
    set((state) => ({
      rowSelection:
        typeof updater === 'function' ? updater(state.rowSelection) : updater,
    })),

  setFilteringQuery: (query) =>
    set({
      filteringQuery: query,
      // 검색어 변경 시 첫 페이지로 이동하고 첫 번째 행 선택
      pagination: { pageIndex: 0, pageSize: 10 },
      rowSelection: { '0': true },
    }),

  setFilteringCategory: (category) =>
    set({
      filteringCategory: category,
      // 카테고리 변경 시 첫 페이지로 이동하고 첫 번째 행 선택
      pagination: { pageIndex: 0, pageSize: 10 },
      rowSelection: { '0': true },
    }),

  setSortOrder: (order) =>
    set({
      sortOrder: order,
      // 정렬 변경 시 첫 페이지로 이동하고 첫 번째 행 선택
      pagination: { pageIndex: 0, pageSize: 10 },
      rowSelection: { '0': true },
    }),

  setKeyword: (keyword) => set({ keyword }),

  reset: () => set(initialState),
}));
