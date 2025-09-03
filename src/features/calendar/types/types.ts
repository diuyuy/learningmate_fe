// src/calendar/types/types.ts

// 앱 공용 타입
export type MissionLevel = 0 | 1 | 2 | 3;

export type DailyData = {
  date: Date;
  missionLevel: number | null;
  hasData: boolean;
  missionBits?: number | null;
};

// 비트 상수 (UI/인코딩 공통) : VIDEO(4) → REVIEW(2) → QUIZ(1)
export const VIDEO = 0b100;
export const REVIEW = 0b010;
export const QUIZ = 0b001;
export const ALL = 0b111;

// API 타입 (네가 준 JSON 스펙과 1:1)
export type StudyStatusItem = {
  id: number;
  keywordId: number;
  studyStats: number; // 0..7
  studyStatusCount: number; // 0..3
  videoCompleted: boolean;
  quizCompleted: boolean;
  reviewCompleted: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type StudyStatusResponse = {
  status: number;
  message: string;
  result: StudyStatusItem[];
};
