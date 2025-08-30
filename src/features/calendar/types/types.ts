export type MissionLevel = 0 | 1 | 2 | 3;

export type DailyData = {
  date: Date;
  missionLevel: number | null;
  hasData: boolean;
  missionBits?: number | null;
};
