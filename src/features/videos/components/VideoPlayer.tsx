// components/VideoPlayer.tsx
import { useEffect, useRef } from 'react';
import { useVideoStore } from '../store/useVideoStore';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

type Props = {
  todaysKeywordId: number;
  videoId: string;
};

export default function VideoPlayer({ todaysKeywordId, videoId }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const startTimeRef = useRef<number | null>(null);
  const checkTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const readyRef = useRef(false); // ✅ 플레이어 onReady 플래그

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

  // todaysKeywordId 반영
  useEffect(() => {
    setTodaysKeywordId(todaysKeywordId);
  }, [todaysKeywordId, setTodaysKeywordId]);

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
          readyRef.current = true;
          const dur = safeGetDuration(event.target);
          if (dur !== null) setDuration(dur);

          if (lastTime > 0 && typeof event.target.seekTo === 'function') {
            event.target.seekTo(lastTime, true);
          }
        },
        onStateChange: (event: any) => {
          const YTState = window.YT.PlayerState;
          if (event.data === YTState.PLAYING) {
            startTimeRef.current = Date.now();

            // 재생 중 60초 달성 체크
            if (!checkTimerRef.current) {
              checkTimerRef.current = setInterval(() => {
                if (!startTimeRef.current || isCompleted) return;
                const diff = Date.now() - startTimeRef.current;
                const total = watchedSeconds + Math.floor(diff / 1000);
                if (total >= 60 && !isCompleted) {
                  alert('오늘의 영상 시청 미션을 성공하셨습니다');
                  setIsCompleted(true);
                  // TODO: DB 저장
                  clearInterval(checkTimerRef.current!);
                  checkTimerRef.current = null;
                }
              }, 1000);
            }
          } else if (
            event.data === YTState.PAUSED ||
            event.data === YTState.ENDED
          ) {
            if (startTimeRef.current) {
              const diff = Date.now() - startTimeRef.current;
              setWatchedSeconds(Math.floor(diff / 1000));

              const cur = safeGetCurrentTime(event.target);
              setLastTime(cur);

              startTimeRef.current = null;
            }
            if (checkTimerRef.current) {
              clearInterval(checkTimerRef.current);
              checkTimerRef.current = null;
            }
          }
        },
      },
    });
  };

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
        const diff = Date.now() - startTimeRef.current;
        setWatchedSeconds(Math.floor(diff / 1000));
        startTimeRef.current = null;
      }
      if (checkTimerRef.current) {
        clearInterval(checkTimerRef.current);
        checkTimerRef.current = null;
      }
    };
  }, [videoId, setWatchedSeconds]);

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
