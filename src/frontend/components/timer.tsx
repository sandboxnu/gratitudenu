import { ReactElement, useEffect, useState } from 'react';
import styles from '../styles/timer.module.scss';

type TimerProps = {
  time: number;
  onTimerOver?: () => void;
  shouldResetTimer?: boolean;
  customClass?: string;
  formatTime?: (time: number) => string;
};

export default function Timer({
  time,
  shouldResetTimer,
  customClass = '',
  formatTime = (time) => time.toString(),
  onTimerOver = () => '',
}: TimerProps): ReactElement {
  const [timeLeft, setTimeLeft] = useState<number>(time);

  useEffect(() => {
    const interval = setInterval(
      () => setTimeLeft((timeLeft) => (timeLeft === 0 ? 0 : timeLeft - 1)),
      1000,
    );

    return () => clearInterval(interval);
  }, [timeLeft]);

  if (timeLeft === 0) {
    onTimerOver();
    if (shouldResetTimer) {
      setTimeLeft(time);
    }
  }
  return (
    <div className={`${styles.timer} ${customClass}`}>
      {formatTime(timeLeft)}
    </div>
  );
}
