// store/useVideoStore.ts
import { create } from 'zustand';

type VideoState = {
  watchedSeconds: number;
  lastTime: number;
  duration: number | null;
  isCompleted: boolean;
  setWatchedSeconds: (sec: number) => void;
  setLastTime: (time: number) => void;
  setDuration: (dur: number) => void;
  setIsCompleted: (result: boolean) => void;
};

export const useVideoStore = create<VideoState>((set) => ({
  watchedSeconds: 0,
  lastTime: 0,
  duration: null,
  isCompleted: false,
  setWatchedSeconds: (sec) =>
    set((state) => ({ watchedSeconds: state.watchedSeconds + sec })),
  setLastTime: (time) => set({ lastTime: time }),
  setDuration: (dur) => set({ duration: dur }),
  setIsCompleted: () => set({ isCompleted: true }),
}));
