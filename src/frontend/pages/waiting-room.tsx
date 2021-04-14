import { useRouter } from 'next/dist/client/router';
import { ReactElement, useState } from 'react';
import { API_URL } from '../api-client';
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
  const waitingRoomUrl = `${API_URL}/waiting-room?playerId=${playerId}`;

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
          time={180}
          formatTime={formatTimeIntoMinutes}
          customClass={styles.timer}
        />
      </div>
      <div className={styles.bottomSection}>
        <div className={styles.gameInstructions}>
          <div className={styles.gameInstructionsHeader}>Game Instructions</div>
          <ol className={styles.gameInstructionsList}>
            <li>
              Select the amount of points you will take for each round (1-10)
              using the slider or the input box.
            </li>
            <li>Click the "Take" button to receive your points.</li>
            <li>
              Points will be replenished by 10% at the end of every round.
              Continue taking points until the game is over.
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
