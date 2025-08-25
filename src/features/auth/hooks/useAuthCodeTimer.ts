import { useEffect, useState } from 'react';

export const useAuthCodeTimer = (startTime: number) => {
  const [seconds, setSeconds] = useState(startTime);
  const [isActive, setIsActive] = useState(false);

  const startTimer = () => {
    setIsActive(true);
    setSeconds(startTime);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 0) {
            stopTimer();
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    return () => {
      console.log('Cleared!!!!!');
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive]);

  return { seconds, startTimer };
};
