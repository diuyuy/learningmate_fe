import { useEffect, useRef } from 'react';
import { useVideoStore } from '../store/useVideoStore';
import { useSaveVideoMission } from '@/hooks/useSaveVideoMission';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

type Props = {
  todaysKeywordId: number; // 오늘의 키워드 ID
  videoId: string; // 유튜브 영상 ID
};

export default function VideoPlayer({ todaysKeywordId, videoId }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  // 재생 구간 시작 시각
  const startTimeRef = useRef<number | null>(null);
  // 재생 중 60초 달성 감시 타이머
  const checkTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    watchedSeconds,
    duration,
    lastTime,
    isCompleted,
    setTodaysKeywordId,
    setWatchedSeconds,
    setLastTime,
    setDuration,
    setIsCompleted,
  } = useVideoStore();

  // 60초 달성 → DB 저장 훅 (리턴 바디 없음, status로 판단)
  const { mutate: saveMission, isPending: saving } =
    useSaveVideoMission(todaysKeywordId);

  // 키워드 반영 (키워드 바뀌면 스토어가 새 미션으로 초기화됨)
  useEffect(() => {
    setTodaysKeywordId(todaysKeywordId);
  }, [todaysKeywordId, setTodaysKeywordId]);

  // 안전 호출 헬퍼
  const safeGetCurrentTime = (player: any): number => {
    try {
      if (player && typeof player.getCurrentTime === 'function') {
        const v = player.getCurrentTime();
        return Number.isFinite(v) ? v : 0;
      }
      if (
        playerRef.current &&
        typeof playerRef.current.getCurrentTime === 'function'
      ) {
        const v = playerRef.current.getCurrentTime();
        return Number.isFinite(v) ? v : 0;
      }
    } catch {}
    return 0;
  };

  const safeGetDuration = (player: any): number | null => {
    try {
      if (player && typeof player.getDuration === 'function') {
        const v = player.getDuration();
        return Number.isFinite(v) ? Math.floor(v) : null;
      }
      if (
        playerRef.current &&
        typeof playerRef.current.getDuration === 'function'
      ) {
        const v = playerRef.current.getDuration();
        return Number.isFinite(v) ? Math.floor(v) : null;
      }
    } catch {}
    return null;
  };

  // ▶ 60초 감시 타이머 시작/유지: 항상 최신 store 값으로 계산
  const startWatchdog = () => {
    if (checkTimerRef.current) return;
    checkTimerRef.current = setInterval(() => {
      const { watchedSeconds: ws, isCompleted: completed } =
        useVideoStore.getState();
      if (completed) {
        clearInterval(checkTimerRef.current!);
        checkTimerRef.current = null;
        return;
      }
      if (!startTimeRef.current) return;
      const diff = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const total = ws + diff;

      if (total >= 60) {
        alert('오늘의 영상 시청 미션을 성공하셨습니다');
        setIsCompleted(true); // 로컬 재팝업 방지
        if (!saving) saveMission(); // DB 저장 (한 번만 시도)
        clearInterval(checkTimerRef.current!);
        checkTimerRef.current = null;
      }
    }, 1000);
  };

  // 플레이어 초기화
  const initPlayer = () => {
    if (!containerRef.current) return;

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      host: 'https://www.youtube.com',
      playerVars: {
        playsinline: 1,
        rel: 0,
        modestbranding: 1,
        enablejsapi: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: (event: any) => {
          const dur = safeGetDuration(event.target);
          if (dur !== null) setDuration(dur);

          if (lastTime > 0 && typeof event.target.seekTo === 'function') {
            event.target.seekTo(lastTime, true);
          }
        },
        onStateChange: (event: any) => {
          const YTState = window.YT.PlayerState;

          if (event.data === YTState.PLAYING) {
            // 재생 시작: 구간 시작 시각 기록(이미 재생 중 재호출되는 경우도 있으니 null일 때만 갱신)
            if (!startTimeRef.current) startTimeRef.current = Date.now();
            // 재생 중 60초 달성 감시 시작
            startWatchdog();
          } else if (
            event.data === YTState.PAUSED ||
            event.data === YTState.ENDED
          ) {
            // 재생 구간 종료: 누적 반영 + 현재 시점 저장
            if (startTimeRef.current) {
              const diff = Math.floor(
                (Date.now() - startTimeRef.current) / 1000
              );
              if (diff > 0) setWatchedSeconds(diff);
              const cur = safeGetCurrentTime(event.target);
              setLastTime(cur);
              startTimeRef.current = null;
            }
            // 타이머 정리
            if (checkTimerRef.current) {
              clearInterval(checkTimerRef.current);
              checkTimerRef.current = null;
            }
          }
        },
      },
    });
  };

  // IFrame API 로딩 & 초기화
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      if (
        !document.querySelector(
          'script[src="https://www.youtube.com/iframe_api"]'
        )
      ) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      // 언마운트 시 flush & 정리
      if (startTimeRef.current) {
        const diff = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (diff > 0) setWatchedSeconds(diff);
        startTimeRef.current = null;
      }
      if (checkTimerRef.current) {
        clearInterval(checkTimerRef.current);
        checkTimerRef.current = null;
      }
    };
    // videoId가 바뀌면 새 인스턴스를 만들도록 현재 구조 유지
  }, [videoId, setWatchedSeconds]);

  // 안전망: 혹시 일시정지하면서 총합이 60을 넘은 경우(=재생 중 경고를 못 띄운 경우)도 커버
  useEffect(() => {
    if (watchedSeconds >= 60 && !isCompleted) {
      alert('오늘의 영상 시청 미션을 성공하셨습니다');
      setIsCompleted(true);
      if (!saving) saveMission();
    }
  }, [watchedSeconds, isCompleted, saveMission, saving, setIsCompleted]);

  const minutes = duration ? Math.floor(duration / 60) : 0;
  const seconds = duration ? Math.floor(duration % 60) : 0;

  return (
    <article className='w-full'>
      <figure className='aspect-video'>
        <div
          ref={containerRef}
          className='w-full h-full rounded-2xl shadow-md'
        />
      </figure>
      <div className='mt-2 space-y-1'>
        <p>키워드: {todaysKeywordId}</p>
        <p>
          누적 시청 시간: {watchedSeconds}초 / {minutes}분 {seconds}초
        </p>
        <p>
          오늘의 미션 : {isCompleted ? <span>성공</span> : <span>실패</span>}
        </p>
      </div>
    </article>
  );
}
