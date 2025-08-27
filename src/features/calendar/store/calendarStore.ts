import { create } from 'zustand';
import { addDays, startOfMonth, startOfToday, endOfMonth } from 'date-fns';
import type { DailyData } from '../types/types';
import { buildMonthData } from '../mock';

const today = startOfToday();

export type StoreState = {
  cursorMonth: Date;
  selectedDate: Date;
  setSelectedDate: (d: Date) => void;
  gotoPrevMonth: () => void;
  gotoNextMonth: () => void;
  setMonth: (anchor: Date) => void;
  monthData: DailyData[];
};

export const useReviewStore = create<StoreState>((set, get) => ({
  cursorMonth: startOfMonth(today),
  selectedDate: today,
  setSelectedDate: (d) => set({ selectedDate: d }),
  gotoPrevMonth: () => {
    const prev = addDays(startOfMonth(get().cursorMonth), -1);
    const month = startOfMonth(prev);
    set({ cursorMonth: month, monthData: buildMonthData(month) });
  },
  gotoNextMonth: () => {
    const next = addDays(endOfMonth(get().cursorMonth), 1);
    const month = startOfMonth(next);
    set({ cursorMonth: month, monthData: buildMonthData(month) });
  },
  setMonth: (anchor) => {
    const month = startOfMonth(anchor);
    set({ cursorMonth: month, monthData: buildMonthData(month) });
  },
  monthData: buildMonthData(today),
}));
