import { format, type Locale } from 'date-fns';
import { tz, TZDate } from '@date-fns/tz';

export const KST_TZ_ID = 'Asia/Seoul';
export const KST = tz(KST_TZ_ID);

/** 이미 타임존 표기가 있으면 그대로, 없으면 UTC(Z)로 간주해서 파싱 */
export function coerceNaiveAsUTC(input: string | number | Date): Date {
  if (typeof input === 'string') {
    if (/[Zz]|[+\-]\d{2}:\d{2}$/.test(input)) return new Date(input);
    // naive ISO → UTC 가정
    return new Date(input + 'Z');
  }
  return new Date(input);
}

/** KST 달력 '같은 날' 비교 */
export function isSameKSTDay(
  a: string | number | Date,
  b: string | number | Date
): boolean {
  const A = new TZDate(a instanceof Date ? a : new Date(a), KST_TZ_ID);
  const B = new TZDate(b instanceof Date ? b : new Date(b), KST_TZ_ID);
  return (
    A.getFullYear() === B.getFullYear() &&
    A.getMonth() === B.getMonth() &&
    A.getDate() === B.getDate()
  );
}

/** 자유 입력(주로 Date) → KST 기준 'yyyy-MM-dd' */
export function kstDateKey(input: string | number | Date): string {
  return format(new Date(input), 'yyyy-MM-dd', { in: KST });
}

/** 백엔드 LocalDateTime(naive, UTC 가정) → KST 기준 'yyyy-MM-dd' */
export function kstDateKeyFromBackend(iso: string): string {
  const d = coerceNaiveAsUTC(iso);
  return format(d, 'yyyy-MM-dd', { in: KST });
}

export function isTodayKST(input: string | number | Date): boolean {
  const a = kstDateKey(input);
  const b = format(new TZDate(new Date(), KST_TZ_ID), 'yyyy-MM-dd');
  return a === b;
}

export function formatKST(
  input: string | number | Date,
  fmt: string,
  opts?: { locale?: Locale }
) {
  return format(new Date(input), fmt, { ...(opts ?? {}), in: KST });
}

export function todayKSTLocalDate(): Date {
  const nowKST = new TZDate(new Date(), KST_TZ_ID);
  return new Date(nowKST.getFullYear(), nowKST.getMonth(), nowKST.getDate());
}
