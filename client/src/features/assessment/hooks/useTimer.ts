import { useState, useEffect, useRef } from 'react';

interface UseTimerProps {
  initialSeconds: number;
  onExpire?: () => void;
  isPaused?: boolean;
}

export const useTimer = ({ initialSeconds, onExpire, isPaused = false }: UseTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isPaused || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onExpireRef.current) {
            onExpireRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, secondsLeft]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const formattedTime =
    hours > 0
      ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isWarning = secondsLeft <= 300 && secondsLeft > 60; // 5 mins
  const isDanger = secondsLeft <= 60; // 1 min

  return {
    secondsLeft,
    formattedTime,
    isWarning,
    isDanger,
    isExpired: secondsLeft <= 0,
  };
};
