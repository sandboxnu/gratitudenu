import { useRouter } from 'next/dist/client/router';
import { ReactElement } from 'react';
import { DEV_URL } from '../api-client';
import Timer from '../components/timer';
import { useEventSource } from '../hooks/useEventSource';

export default function WaitingRoom(): ReactElement {
  const router = useRouter();

  const { playerId } = router.query;
  const pid = Number(playerId);

  // subscribe to waiting room on load
  useEventSource(`${DEV_URL}/waiting-room?playerId=${playerId}`, (message) => {
    console.log(message);
  });

  const formatTimeIntoMinutes = (timer: number) => {
    const minutes = Math.floor(timer / 60);

    const seconds = timer % 60;
    return `${minutes}:${seconds === 0 ? '00' : seconds}`;
  };

  return (
    <div>
      <div>You are in the waiting room </div>
      <Timer
        time={900}
        onTimerOver={() => {}}
        formatTime={formatTimeIntoMinutes}
      />
    </div>
  );
}
