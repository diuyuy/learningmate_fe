import { useEffect, useRef } from 'react';
import { useVideoStore } from '../store/useVideoStore';
import { useSaveVideoMission } from '../hooks/useSaveVideoMission';

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
  const dayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    ensureKstDay,
  } = useVideoStore();

  const { mutate: saveMission, isPending: saving } =
    useSaveVideoMission(todaysKeywordId);

  useEffect(() => {
    ensureKstDay();
    setTodaysKeywordId(todaysKeywordId);
  }, [todaysKeywordId, ensureKstDay, setTodaysKeywordId]);

  useEffect(() => {
    if (dayTimerRef.current) clearInterval(dayTimerRef.current);
    dayTimerRef.current = setInterval(() => {
      ensureKstDay();
    }, 60_000);
    return () => {
      if (dayTimerRef.current) {
        clearInterval(dayTimerRef.current);
        dayTimerRef.current = null;
      }
    };
  }, [ensureKstDay]);

  const safeGetCurrentTime = (player: any): number => {
    try {
      if (player?.getCurrentTime) {
        const v = player.getCurrentTime();
        return Number.isFinite(v) ? v : 0;
      }
      if (playerRef.current?.getCurrentTime) {
        const v = playerRef.current.getCurrentTime();
        return Number.isFinite(v) ? v : 0;
      }
    } catch {}
    return 0;
  };

  const safeGetDuration = (player: any): number | null => {
    try {
      if (player?.getDuration) {
        const v = player.getDuration();
        return Number.isFinite(v) ? Math.floor(v) : null;
      }
      if (playerRef.current?.getDuration) {
        const v = playerRef.current.getDuration();
        return Number.isFinite(v) ? Math.floor(v) : null;
      }
    } catch {}
    return null;
  };

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
        setIsCompleted(true);
        if (!saving) saveMission();
        clearInterval(checkTimerRef.current!);
        checkTimerRef.current = null;
      }
    }, 1000);
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
          const dur = safeGetDuration(event.target);
          if (dur !== null) setDuration(dur);
          if (lastTime > 0 && event.target.seekTo) {
            event.target.seekTo(lastTime, true);
          }
        },
        onStateChange: (event: any) => {
          const S = window.YT.PlayerState;
          if (event.data === S.PLAYING) {
            if (!startTimeRef.current) startTimeRef.current = Date.now();
            startWatchdog();
          } else if (event.data === S.PAUSED || event.data === S.ENDED) {
            if (startTimeRef.current) {
              const diff = Math.floor(
                (Date.now() - startTimeRef.current) / 1000
              );
              if (diff > 0) setWatchedSeconds(diff);
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
    if (window.YT?.Player) {
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
  }, [videoId, setWatchedSeconds, setLastTime, setDuration]);

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
