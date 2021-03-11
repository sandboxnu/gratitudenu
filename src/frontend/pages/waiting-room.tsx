import { useRouter } from 'next/dist/client/router';
import { ReactElement } from 'react';
import { API, DEV_URL } from '../api-client';
import { useEventSource } from '../hooks/useEventSource';

export default function WaitingRoom(): ReactElement {
  const router = useRouter();

  const { playerId } = router.query;
  const pid = Number(playerId);

  // subscribe to waiting room on load
  useEventSource(`${DEV_URL}/waiting-room?playerId=${playerId}`, (message) => {
    console.log(message);
  });

  return <div>Welcome to the waiting room {playerId}</div>;
}
