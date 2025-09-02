import { create } from 'zustand';
import { addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import type { DailyData } from '../types/types';
import { todayKSTLocalDate } from '@/lib/timezone';

function buildMonthSkeleton(anchor: Date): DailyData[] {
  const start = startOfMonth(anchor);
  const end = endOfMonth(anchor);
  return eachDayOfInterval({ start, end }).map((date) => ({
    date,
    missionLevel: null,
    hasData: false,
    missionBits: null,
  }));
}

export type StoreState = {
  cursorMonth: Date;
  selectedDate: Date;
  monthData: DailyData[];
  setSelectedDate: (d: Date) => void;
  gotoPrevMonth: () => void;
  gotoNextMonth: () => void;
  setMonth: (anchor: Date) => void;
};

export const useReviewStore = create<StoreState>((set, get) => {
  const today = todayKSTLocalDate();
  const initialMonth = startOfMonth(today);

  return {
    cursorMonth: initialMonth,
    selectedDate: today,
    monthData: buildMonthSkeleton(initialMonth),

    setSelectedDate: (d) => set({ selectedDate: d }),

    gotoPrevMonth: () => {
      const prev = addDays(startOfMonth(get().cursorMonth), -1);
      const month = startOfMonth(prev);
      set({ cursorMonth: month, monthData: buildMonthSkeleton(month) });
    },

    gotoNextMonth: () => {
      const next = addDays(endOfMonth(get().cursorMonth), 1);
      const month = startOfMonth(next);
      set({ cursorMonth: month, monthData: buildMonthSkeleton(month) });
    },

    setMonth: (anchor) => {
      const month = startOfMonth(anchor);
      set({ cursorMonth: month, monthData: buildMonthSkeleton(month) });
    },
  };
});
