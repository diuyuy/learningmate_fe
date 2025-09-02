import { nowKstDateKey } from '@/lib/timezone';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type VideoState = {
  // 기준 키: 'YYYY-MM-DD' (KST)
  kstDateKey: string;
  todaysKeywordId: number | null;

  watchedSeconds: number;
  lastTime: number;
  duration: number | null;
  isCompleted: boolean;

  /** KST '오늘' 기준을 보정 (자정 지나면 자동 초기화) */
  ensureKstDay: () => void;

  /** 오늘의 keywordId 세팅 (키/키워드 변경 시 초기화) */
  setTodaysKeywordId: (id: number) => void;

  setWatchedSeconds: (inc: number) => void;
  setLastTime: (time: number) => void;
  setDuration: (dur: number) => void;
  setIsCompleted: (result?: boolean) => void;

  /** 스토어 전체 초기화(키는 현재 KST 로 새로 설정) */
  resetAll: () => void;
};

export const useVideoStore = create<VideoState>()(
  persist(
    (set, get) => ({
      kstDateKey: nowKstDateKey(),
      todaysKeywordId: null,

      watchedSeconds: 0,
      lastTime: 0,
      duration: null,
      isCompleted: false,

      ensureKstDay: () => {
        const nowKey = nowKstDateKey();
        if (get().kstDateKey !== nowKey) {
          // KST 하루 바뀜 → 초기화
          set({
            kstDateKey: nowKey,
            todaysKeywordId: null,
            watchedSeconds: 0,
            lastTime: 0,
            duration: null,
            isCompleted: false,
          });
        }
      },

      setTodaysKeywordId: (id) => {
        const nowKey = nowKstDateKey();
        const s = get();
        // 날짜가 바뀌었거나 키워드가 바뀌면 초기화
        if (s.kstDateKey !== nowKey || s.todaysKeywordId !== id) {
          set({
            kstDateKey: nowKey,
            todaysKeywordId: id,
            watchedSeconds: 0,
            lastTime: 0,
            duration: null,
            isCompleted: false,
          });
          return;
        }
        // 동일 날짜/동일 키워드라면 유지
        set({ todaysKeywordId: id });
      },

      setWatchedSeconds: (inc) => {
        const { isCompleted } = get();
        if (isCompleted) return;
        const add = Math.max(0, Math.floor(inc || 0));
        if (!add) return;
        set((s) => ({ watchedSeconds: s.watchedSeconds + add }));
      },

      setLastTime: (time) => {
        if (get().isCompleted) return;
        set({ lastTime: Math.max(0, Math.floor(time || 0)) });
      },

      setDuration: (dur) =>
        set({ duration: Math.max(0, Math.floor(dur || 0)) }),

      setIsCompleted: (result = true) => set({ isCompleted: !!result }),

      resetAll: () =>
        set({
          kstDateKey: nowKstDateKey(),
          todaysKeywordId: null,
          watchedSeconds: 0,
          lastTime: 0,
          duration: null,
          isCompleted: false,
        }),
    }),
    {
      name: 'watchVideoStatus',
      version: 2, // ← 버전 올려 stale 상태 초기화 유도 (기존 v1 -> v2)
      // 필요시 migrate 로직도 추가 가능
    }
  )
);
