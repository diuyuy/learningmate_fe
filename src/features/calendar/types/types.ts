export type MissionLevel = 0 | 1 | 2 | 3;

export type DailyData = {
  date: Date;
  missionLevel: MissionLevel | null;
  hasData: boolean;
};
