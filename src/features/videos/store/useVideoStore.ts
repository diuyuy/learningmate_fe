// store/useVideoStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type VideoState = {
  // 하루에 한 번 외부에서 바뀌는 오늘의 키워드 ID (number)
  todaysKeywordId: number | null;

  // 누적/재개/완료 상태
  watchedSeconds: number;
  lastTime: number;
  duration: number | null;
  isCompleted: boolean;

  // setters
  setWatchedSeconds: (sec: number) => void;
  setLastTime: (time: number) => void;
  setDuration: (dur: number) => void;
  setIsCompleted: (result?: boolean) => void;

  // 키워드 세팅(바뀌면 전부 초기화)
  setTodaysKeywordId: (id: number) => void;

  // 강제 초기화(영상 교체 등)
  resetAll: () => void;
};

export const useVideoStore = create<VideoState>()(
  persist(
    (set, get) => ({
      todaysKeywordId: null,
      watchedSeconds: 0,
      lastTime: 0,
      duration: null,
      isCompleted: false,

      setWatchedSeconds: (sec) =>
        set((state) => ({
          watchedSeconds: Math.max(
            0,
            state.watchedSeconds + Math.floor(sec || 0)
          ),
        })),
      setLastTime: (time) =>
        set({ lastTime: Math.max(0, Math.floor(time || 0)) }),
      setDuration: (dur) =>
        set({ duration: Math.max(0, Math.floor(dur || 0)) }),
      setIsCompleted: (result = true) => set({ isCompleted: !!result }),

      setTodaysKeywordId: (id: number) => {
        const prev = get().todaysKeywordId;
        if (prev !== id) {
          // 키워드가 바뀌면 전부 초기화
          set({
            todaysKeywordId: id,
            watchedSeconds: 0,
            lastTime: 0,
            duration: null,
            isCompleted: false,
          });
        } else {
          // 동일 키워드면 그대로 유지
          set({ todaysKeywordId: id });
        }
      },

      resetAll: () =>
        set({
          watchedSeconds: 0,
          lastTime: 0,
          duration: null,
          isCompleted: false,
        }),
    }),
    {
      name: 'watchVideoStatus', // localStorage key
      version: 1,
    }
  )
);
