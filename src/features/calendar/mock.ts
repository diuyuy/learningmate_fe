// mock.ts
import {
  eachDayOfInterval,
  endOfMonth,
  isAfter,
  startOfMonth,
  startOfToday,
  min as dfMin,
} from 'date-fns';
import type { DailyData, MissionLevel } from './types/types';

/** 타임존 안전: 모든 날짜는 로컬 정오로 정규화 */
const toLocalNoon = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);

const todayNoon = toLocalNoon(startOfToday());

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;

/** 서버가 내려주는 행(스샷 가정) */
export type ServerRow = {
  id: number;
  keyword_id: number;
  member_id: number;
  study_stats: number; // 0~7 (3비트)
  created_at: string; // 'YYYY-MM-DD 12:00:00.000000'
  updated_at: string; // 'YYYY-MM-DD 12:00:00.000000'
};

const parseToNoon = (dt: string) => {
  const d = new Date(dt.replace(' ', 'T')); // ' ' → 'T' 로컬 파싱
  return toLocalNoon(d);
};

/** 0..7 → 완료 개수(0..3) */
const POPCOUNT3: MissionLevel[] = [0, 1, 1, 2, 1, 2, 2, 3];

/** (모의) 서버 rows 생성: 과거/오늘은 "모든 날"에 행 생성, 미래 달은 0건 */
function mockFetchMonthRowsFromServer(
  anchor: Date,
  ctx?: { memberId?: number; keywordId?: number }
): ServerRow[] {
  const memberId = ctx?.memberId ?? 1;
  const keywordId = ctx?.keywordId ?? 1;

  const start = startOfMonth(anchor);
  const end = endOfMonth(anchor);
  const until = dfMin([end, todayNoon]); // 미래 제외 (오늘 포함)

  // 미래 달(해당 월의 시작이 오늘 이후)이면 생성 안 함
  if (until < start) return [];

  const days = eachDayOfInterval({ start, end: until });

  let id = 1;
  const toTs = (d: Date) => `${ymd(d)} 12:00:00.000000`;

  // ✅ 과거/오늘: 모든 날에 대해 반드시 1행 생성 (최소 000 가능)
  return days.map((d0) => {
    const d = toLocalNoon(d0);
    const day = d.getDate();

    // 결정적 패턴(원하면 마음대로 바꾸세요)
    // quiz(1): 홀수날, review(2): 3의 배수, video(4): (day%7) in {2,4,6}
    const quiz = day % 2 ? 1 : 0;
    const review = day % 3 === 0 ? 2 : 0;
    const video = [2, 4, 6].includes(day % 7) ? 4 : 0;

    const stats = (quiz | review | video) & 7; // 0..7 (000~111)

    return {
      id: id++,
      keyword_id: keywordId,
      member_id: memberId,
      study_stats: stats,
      created_at: toTs(d),
      updated_at: toTs(d),
    };
  });
}

/** 서버 rows → 캘린더 DailyData[] */
function buildMonthDataFromServerRows(
  anchor: Date,
  rows: ServerRow[]
): DailyData[] {
  const start = startOfMonth(anchor);
  const end = endOfMonth(anchor);

  // 같은 날짜 여러 행 → 비트 OR로 병합 (혹시 모를 중복 대비)
  const byDayOr = new Map<string, number>();
  for (const r of rows) {
    const d = parseToNoon(r.created_at);
    if (d < start || d > end) continue;
    const key = ymd(d);
    const merged = (byDayOr.get(key) ?? 0) | (r.study_stats ?? 0);
    byDayOr.set(key, merged);
  }

  return eachDayOfInterval({ start, end }).map((d0) => {
    const d = toLocalNoon(d0);
    const key = ymd(d);
    const stats = byDayOr.get(key);

    const missionLevel =
      typeof stats === 'number' ? (POPCOUNT3[stats & 7] as MissionLevel) : null;

    // 과거/오늘: true, 미래: false
    const hasData = !isAfter(d, todayNoon);

    return {
      date: d,
      missionLevel, // 완료 개수(0~3) 또는 null
      hasData, // 미래일 false
      missionBits:
        typeof stats === 'number' // 원본 비트(0~7) 또는 null
          ? stats & 7
          : null,
    };
  });
}

/** 외부 공개 API (기존처럼 사용) */
export function buildMonthData(anchor: Date): DailyData[] {
  const rows = mockFetchMonthRowsFromServer(anchor);
  return buildMonthDataFromServerRows(anchor, rows);
}
