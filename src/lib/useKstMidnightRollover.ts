import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { nowKstDateKey } from '@/lib/timezone';
import { QUERY_KEYS } from '@/constants/querykeys';

export function useKstMidnightRollover(intervalMs = 60_000) {
  const qc = useQueryClient();
  const lastKeyRef = useRef(nowKstDateKey());

  useEffect(() => {
    const id = setInterval(() => {
      const cur = nowKstDateKey();
      if (cur !== lastKeyRef.current) {
        lastKeyRef.current = cur;

        qc.invalidateQueries({ queryKey: [QUERY_KEYS.KEYWORDS], exact: false });

        qc.invalidateQueries({
          predicate: (q) => {
            const k = q.queryKey as (string | number)[];
            return (
              Array.isArray(k) &&
              k[0] === QUERY_KEYS.REVIEWS &&
              k[1] === 'keyword'
            );
          },
        });

        qc.invalidateQueries({
          predicate: (q) => {
            const k = q.queryKey as (string | number)[];
            return Array.isArray(k) && k[0] === 'study-status';
          },
        });
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [qc, intervalMs]);
}
