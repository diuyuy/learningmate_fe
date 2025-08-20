// components/VideoPlayer.tsx
import { useEffect, useRef } from 'react';
import { useVideoStore } from '../store/useVideoStore';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function VideoPlayer() {
  const videoId = 'vbjLJnlB2kg';

  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const startTimeRef = useRef<number | null>(null);

  const {
    watchedSeconds,
    duration,
    lastTime,
    isCompleted,
    setWatchedSeconds,
    setLastTime,
    setDuration,
    setIsCompleted,
  } = useVideoStore();

  const initPlayer = () => {
    if (!containerRef.current) return;

    if (
      playerRef.current &&
      typeof playerRef.current.getDuration === 'function'
    ) {
      const iframe = playerRef.current.getIframe();
      if (iframe.parentElement !== containerRef.current) {
        iframe.parentElement?.removeChild(iframe);
        containerRef.current.appendChild(iframe);
      }
      if (lastTime > 0) playerRef.current.seekTo(lastTime, true);

      setDuration(playerRef.current.getDuration());
      return;
    }

    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId,
      playerVars: { playsinline: 1 },
      events: {
        onReady: (event: any) => {
          setDuration(event.target.getDuration());

          if (lastTime > 0) event.target.seekTo(lastTime, true);
        },
        onStateChange: (event: any) => {
          switch (event.data) {
            case window.YT.PlayerState.PLAYING:
              startTimeRef.current = Date.now();
              break;
            case window.YT.PlayerState.PAUSED:
            case window.YT.PlayerState.ENDED:
              if (startTimeRef.current) {
                const diff = Date.now() - startTimeRef.current;
                setWatchedSeconds(Math.floor(diff / 1000));

                const current = playerRef.current?.getCurrentTime() || 0;
                setLastTime(current);

                startTimeRef.current = null;
              }
              break;
            default:
              break;
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
      if (startTimeRef.current) {
        const diff = Date.now() - startTimeRef.current;
        setWatchedSeconds(Math.floor(diff / 1000));
        startTimeRef.current = null;
      }
    };
  }, [videoId]);

  useEffect(() => {
    if (watchedSeconds >= 60 && !isCompleted) {
      alert('오늘의 영상 시청 미션을 성공하셨습니다');
      setIsCompleted(true);
      // Todo : db에 상태 변경 저장
    }
  }, [watchedSeconds, isCompleted]);

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
      <div>
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
