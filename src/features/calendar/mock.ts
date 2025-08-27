// mock.ts
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  startOfMonth,
  startOfToday,
} from 'date-fns';
import type { DailyData, MissionLevel } from './types/types';

const today = startOfToday();

function mockMissionLevel(date: Date): MissionLevel {
  const d = Number(format(date, 'd'));
  return (d % 4) as MissionLevel;
}

export function buildMonthData(anchor: Date): DailyData[] {
  const start = startOfMonth(anchor);
  const end = endOfMonth(anchor);

  return eachDayOfInterval({ start, end }).map((date) => {
    const hasData = !isAfter(date, today);
    return {
      date,
      missionLevel: hasData ? mockMissionLevel(date) : null,
      hasData,
    };
  });
}
