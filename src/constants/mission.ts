import type { MissionLevel } from '@/features/calendar/types/types';

export const missionClass: Record<MissionLevel, string> = {
  0: 'bg-red-500',
  1: 'bg-orange-400',
  2: 'bg-lime-400',
  3: 'bg-green-500',
};
