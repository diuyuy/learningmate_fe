import { useEffect, useState } from 'react';

export const useAuthCodeTimer = (startTime: number) => {
  const [seconds, setSeconds] = useState(startTime);

  const resetTimer = () => {
    setSeconds(startTime);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(seconds);

      setSeconds((prevSeconds) => {
        if (prevSeconds <= 0) return 0;
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { seconds, resetTimer };
};
