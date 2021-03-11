import { useRouter } from 'next/dist/client/router';
import { ReactElement, useState } from 'react';
import { DEV_URL } from '../api-client';
import Fraction from '../components/fraction';
import Timer from '../components/timer';
import { useEventSource } from '../hooks/useEventSource';

const MAX_PLAYERS = 4;
export default function WaitingRoom(): ReactElement {
  const router = useRouter();

  const { playerId } = router.query;
  const [players, setPlayers] = useState(1); // assume it is just us to begin with

  // subscribe to waiting room on load
  useEventSource(`${DEV_URL}/waiting-room?playerId=${playerId}`, (message) => {
    console.log(players);
    if (message.players) {
      setPlayers(message.players);
    }
  });

  const formatTimeIntoMinutes = (timer: number) => {
    const minutes = Math.floor(timer / 60);

    const seconds = timer % 60;
    return `${minutes}:${seconds === 0 ? '00' : seconds}`;
  };

  return (
    <div>
      <div>
        <div>You are in the waiting room </div>
        <Timer
          time={900}
          onTimerOver={() => {}}
          formatTime={formatTimeIntoMinutes}
        />
      </div>
      <div>
        <div>
          <div>Game Instructions</div>
          <ol>
            <li>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh sem
              eget felis aliquet.
            </li>
            <li>Nulla proin diam quam sollicitudin ut ac consectetur.</li>
            <li>Elit nunc, elementum mi eget nibh consequat, odio massa.</li>
            <li>
              Sit amet risus tristique cursus ut dis id. Nisi ultrices id varius
              sapien, nulla.
            </li>
          </ol>
        </div>
        <div>
          <div>The game will begin when the room is filled:</div>
          <div>
            <Fraction numerator={players} denominator={MAX_PLAYERS} />
          </div>
        </div>
      </div>
    </div>
  );
}
