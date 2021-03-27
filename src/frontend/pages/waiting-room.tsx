import { useRouter } from 'next/dist/client/router';
import { ReactElement, useState } from 'react';
import { DEV_URL } from '../api-client';
import Timer from '../components/timer';
import { useEventSource } from '../hooks/useEventSource';
import { useSetting } from '../hooks/useSetting';
import styles from '../styles/WaitingRoom.module.scss';
import { PLAYERS } from './admin';

export default function WaitingRoom(): ReactElement {
  const router = useRouter();
  const playersPerGame = useSetting(PLAYERS);

  const { playerId } = router.query;
  const [players, setPlayers] = useState(1); // assume it is just us to begin with
  const waitingRoomUrl = `${DEV_URL}/waiting-room?playerId=${playerId}`;

  // subscribe to waiting room on load
  useEventSource(waitingRoomUrl, (message) => {
    if (message.players) {
      setPlayers(message.players);
    } else if (message.timeout) {
      router.push(`/thank-you`);
    } else if (message.gameId) {
      router.push(`/game?gameId=${message.gameId.gameId}&playerId=${playerId}`);
    }
  });

  const formatTimeIntoMinutes = (timer: number) => {
    const minutes = Math.floor(timer / 60);

    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className={styles.waitingRoom}>
      <div className={styles.headerSection}>
        <div className={styles.header}>You are in the waiting room </div>
        <Timer
          time={900}
          formatTime={formatTimeIntoMinutes}
          customClass={styles.timer}
        />
      </div>
      <div className={styles.bottomSection}>
        <div className={styles.gameInstructions}>
          <div className={styles.gameInstructionsHeader}>Game Instructions</div>
          <ol className={styles.gameInstructionsList}>
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
        <div className={styles.playerCountSection}>
          <div className={styles.playerCountHeader}>
            The game will begin when the room is filled:
          </div>
          <div className={styles.playerCountFraction}>
            {players}/{playersPerGame}
          </div>
        </div>
      </div>
    </div>
  );
}
