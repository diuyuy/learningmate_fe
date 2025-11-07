import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nowKstDateKey } from '@/lib/timezone';

export const MISSION_TARGET = 60 as const;

type VideoState = {
  // day/key
  kstDateKey: string;
  todaysKeywordId: number | null;

  // playback progress
  watchedSeconds: number; // 누적(정수, 초)
  lastTime: number; // 유튜브 최근 위치(정수, 초)
  duration: number | null;
  isCompleted: boolean;

  // actions
  ensureKstDay: () => void;
  setTodaysKeywordId: (id: number) => void;

  setWatchedSeconds: (inc: number) => void; // +증분
  setLastTime: (time: number) => void; // 절대치
  setDuration: (dur: number) => void; // 절대치

  /** 이미 완료면 아무것도 하지 않고 false 반환, 처음 완료되면 true */
  completeOnce: () => boolean;

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
        // 날짜 or 키워드 변경 시에만 초기화
        if (s.kstDateKey !== nowKey || s.todaysKeywordId !== id) {
          set({
            kstDateKey: nowKey,
            todaysKeywordId: id,
            watchedSeconds: 0,
            lastTime: 0,
            duration: null,
            isCompleted: false,
          });
        }
        // 동일한 경우는 no-op
      },

      setWatchedSeconds: (inc) => {
        if (get().isCompleted) return;
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

      completeOnce: () => {
        const s = get();
        if (s.isCompleted) return false;
        // 목표치로 클램프
        const clamped = Math.max(s.watchedSeconds, MISSION_TARGET);
        set({ watchedSeconds: clamped, isCompleted: true });
        return true;
      },

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
      version: 3, // ⬅️ 스토어 변경에 따라 버전 업
    }
  )
);
