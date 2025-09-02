// src/calendar/store/calendarStore.ts
import { create } from 'zustand';
import { addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import type { DailyData } from '../types/types';
import { TZDate } from '@date-fns/tz';

/** KST(Asia/Seoul) 기준 '오늘 00:00'과 동일한 로컬 Date 생성 */
function todayKSTLocalDate(): Date {
  const nowKST = new TZDate(new Date(), 'Asia/Seoul'); // KST 시각
  const y = nowKST.getFullYear();
  const m = nowKST.getMonth(); // 0..11
  const d = nowKST.getDate();
  return new Date(y, m, d); // 로컬 Date이지만 KST 자정과 같은 '날짜'를 가리키도록 구성
}

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
  monthData: DailyData[]; // 스켈레톤만 저장
  setSelectedDate: (d: Date) => void;
  gotoPrevMonth: () => void;
  gotoNextMonth: () => void;
  setMonth: (anchor: Date) => void;
};

export const useReviewStore = create<StoreState>((set, get) => {
  // ✅ KST 기준 오늘
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
