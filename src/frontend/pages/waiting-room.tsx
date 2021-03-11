import { useRouter } from 'next/dist/client/router';
import { ReactElement } from 'react';

export default function WaitingRoom(): ReactElement {
  const router = useRouter();

  const { playerId } = router.query;

  return <div>Welcome to the waiting room {playerId}</div>;
}
