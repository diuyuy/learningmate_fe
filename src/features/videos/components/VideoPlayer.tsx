import { useEffect, useRef, useState } from 'react';
import {
  getLastTime,
  getPlayerInstance,
  setLastTime,
  setPlayerInstance,
} from '../hooks/singtonePlayer';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function VideoPlayer() {
  const videoId = 'vbjLJnlB2kg';
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState('초기화 대기 중...');
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  const initPlayer = () => {
    if (!playerRef.current) return;

    const existingPlayer = getPlayerInstance();
    if (existingPlayer) {
      const iframe = existingPlayer.getIframe();
      if (iframe.parentElement !== playerRef.current) {
        iframe.parentElement?.removeChild(iframe);
        playerRef.current.appendChild(iframe);
      }
      const lastTime = getLastTime();
      if (lastTime > 0) existingPlayer.seekTo(lastTime, true);

      setStatus('플레이어 준비 완료');
      setDuration(existingPlayer.getDuration());
      return;
    }

    const instance = new window.YT.Player(playerRef.current, {
      videoId,
      playerVars: { playsinline: 1 },
      events: {
        onReady: (event: any) => {
          setStatus('플레이어 준비 완료');
          setDuration(event.target.getDuration());

          const lastTime = getLastTime();
          if (lastTime > 0) event.target.seekTo(lastTime, true);
        },
        onStateChange: (event: any) => {
          switch (event.data) {
            case window.YT.PlayerState.PLAYING:
              setStatus('▶️ 재생 중');
              startTimeRef.current = Date.now();
              break;
            case window.YT.PlayerState.PAUSED:
            case window.YT.PlayerState.ENDED:
              if (startTimeRef.current) {
                const diff = Date.now() - startTimeRef.current;
                setWatchedSeconds((prev) => prev + Math.floor(diff / 1000));

                const current = getPlayerInstance()?.getCurrentTime() || 0;
                setLastTime(current);

                startTimeRef.current = null;
              }
              setStatus(
                event.data === window.YT.PlayerState.PAUSED
                  ? '⏸️ 일시정지'
                  : '⏹️ 종료됨'
              );
              break;
            default:
              break;
          }
        },
      },
    });

    setPlayerInstance(instance);
  };

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (startTimeRef.current) {
        const diff = Date.now() - startTimeRef.current;
        setWatchedSeconds((prev) => prev + Math.floor(diff / 1000));
        startTimeRef.current = null;
      }
    };
  }, [videoId]);

  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);

  return (
    <article className='w-full'>
      <figure className='aspect-video'>
        <div ref={playerRef} className='w-full h-full rounded-2xl shadow-md' />
      </figure>
      <div>
        <p>{status}</p>
        <p>
          누적 시청 시간: {watchedSeconds}초 / {minutes}분 {seconds}초
        </p>
      </div>
    </article>
  );
}
