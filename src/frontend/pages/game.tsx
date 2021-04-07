import Head from 'next/head';
import styles from '../styles/Game.module.scss';
import Slider from 'react-input-slider';
import Modal from 'react-modal';
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { ReactElement, useEffect, useState } from 'react';
import Image from 'next/image';
import gameConstants from '../constants/gameConstants';
import GameModal from '../components/gameModal';
import Colors from '../constants/colorConstants';
import { API, API_URL } from '../api-client';
import { useRouter } from 'next/dist/client/router';
import { useEventSource } from '../hooks/useEventSource';
import toast from 'toasted-notes';
import 'toasted-notes/src/styles.css';

/**
 * TODO: Account for varying number of players in this view
 */

export default function Home(): ReactElement {
  /**
   * *STATE VARIABLES*
   * -takeVal: currently selected coins from slider that they are taking that turn
   * timeLeft: time left on the timer (starts at 10 seconds)
   * modalIsOpen: for modal open close
   * playerColor: value brought in from endpoint for this userID, will be one of ('Green', 'Yellow', 'Red', 'Blue)
   * playerCoins: total # of coins that this user has in this game
   *
   */
  const [pointsRemaining, setPointsRemaining] = useState<number>(
    gameConstants.INIT_TOTAL_COINS,
  );
  const [takeVal, setTakeVal] = useState<number>(gameConstants.MIN_TAKE_VAL);
  const TIMER_SECONDS = 10;
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [playerPoints, setPlayerPoints] = useState<number>(
    gameConstants.INIT_PLAYER_COINS,
  );
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const router = useRouter();
  const { gameId, playerId } = router.query;
  const [timeLeft, setTimeLeft] = useState<number>(
    gameConstants.INIT_TIME_LEFT,
  );
  const [takeComplete, setTakeComplete] = useState<boolean>(false);
  const [gameOverModalIsOpen, setGameOverModalIsOpen] = useState<boolean>(
    false,
  );

  const gameUrl = `${API_URL}/game/sse?playerId=${playerId}&gameId=${gameId}`;
  useEventSource(gameUrl, (message) => {
    if (message.endMessage) {
      setGameOverModalIsOpen(true);
    } else if (message.newRound !== undefined) {
      toast.notify('New Round Beginning!', {
        duration: 2000,
        position: 'bottom-left',
      });
      setPointsRemaining(message.newRound.pointsRemaining);
      setRoundNumber(message.newRound.roundNumber);
      setTimeLeft(gameConstants.INIT_TIME_LEFT);
      setTakeComplete(false);
    }
  });

  const pId = Number.parseInt(playerId as string);
  const handleTake = async () => {
    toast.notify('You took ' + takeVal + 'points!', {
      duration: 2000,
      position: 'bottom-left',
    });
    if (!takeComplete) {
      setTakeComplete(true);
      setPlayerPoints(playerPoints + takeVal);

      await API.game.take({
        playerId: pId,
        howMany: takeVal,
        timeTaken: TIMER_SECONDS - timeLeft,
        roundNumber: roundNumber,
      });
    }
  };

  const inputOnChange = (eventVal: string) => {
    const intVal = parseInt(eventVal);

    if (intVal < 0) {
      alert('Input cannot be negative');
      setTakeVal(0);
    } else if (intVal > 10) {
      alert('Input cannot be greater than 10');
      setTakeVal(takeVal);
    } else {
      setTakeVal(intVal);
    }
  };

  useEffect(() => {
    const interval = setInterval(
      () => setTimeLeft((timeLeft) => (timeLeft === 0 ? 0 : timeLeft - 1)),
      1000,
    );

    return () => clearInterval(interval);
  }, [timeLeft]);

  // make this not show up twice
  if (timeLeft <= 3 && !takeComplete) {
    toast.notify('Time is Running Out!', {
      duration: 3000,
      position: 'bottom-left',
    });
  }

  if (timeLeft === 0 && !takeComplete) {
    handleTake();
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>RDG NU | Game Page</title>
        <link rel="icon" href="/favicon.ico?v=1" />
      </Head>

      <main className={styles.main}>
        <GameModal isOpen={gameOverModalIsOpen} text={'Game over'} />
        <GameModal
          isOpen={takeComplete && !gameOverModalIsOpen}
          text="Wait for other players..."
        />
        <div className={styles.infoSection}>
          <p className={styles.infoSectionTitle}>Game</p>
          <Image
            src={'/help-icon.svg'}
            alt={'Help icon'}
            width={35}
            height={35}
            onClick={() => setModalIsOpen(true)}
          />
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            style={{
              content: {
                top: '20%',
                left: '60%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                maxWidth: '500px',
                transform: 'translate(-50%, -50%)',
              },
            }}
            contentLabel="Instructions Modal"
          >
            <GameInstructionsModal />
          </Modal>
        </div>

        <div className={styles.gameDisplay}>
          <GameTable pointsRemaining={pointsRemaining} />
          <div
            className={timeLeft <= 3 ? `${styles.turnRed}` : `${styles.timer}`}
          >
            {timeLeft}
          </div>
        </div>

        <div className={styles.actionBar}>
          <div className={styles.actionBarLeft}>
            <h4 className={styles.actionBarText}>
              You Are:{' '}
              <span
                style={{ color: gameConstants.DEFAULT_COLOR.toLowerCase() }}
              >
                {gameConstants.DEFAULT_COLOR}{' '}
              </span>
            </h4>
            <h4 className={styles.actionBarText}>
              Your Total Points:{' '}
              <span style={{ color: Colors.darkPurple }}>{playerPoints} </span>
            </h4>
          </div>
          <div className={styles.actionBarMiddle}>
            <input
              type="number"
              value={takeVal}
              min={gameConstants.MIN_TAKE_VAL}
              max={gameConstants.MAX_TAKE_VAL}
              className={styles.actionBarInput}
              disabled
            />

            <span className={styles.slider}>
              <Slider
                axis="x"
                x={takeVal}
                onChange={({ x }) => setTakeVal(x)}
                styles={{
                  active: {
                    backgroundColor: Colors.darkBlue,
                  },
                  thumb: {
                    backgroundColor: Colors.darkPurple,
                  },
                }}
                xmax={gameConstants.MAX_TAKE_VAL}
              />
            </span>
          </div>
          <div className={styles.actionBarRight}>
            <button
              className={styles.actionBarTake}
              onClick={handleTake}
              disabled={takeComplete}
            >
              Take
            </button>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Sandbox
        </a>
      </footer>
    </div>
  );
}

// GAME TABLE HERE
interface GameTableProps {
  pointsRemaining: number;
}

export const GameTable = ({
  pointsRemaining,
}: GameTableProps): ReactElement => {
  return (
    <div className={styles.gameTable}>
      <div className={styles.gameTableColumn}>
        <div className={styles.topPlayer}>
          <Image
            src="/player-icon-green.svg"
            alt="green"
            width={110}
            height={140}
          />
        </div>
        <div>
          <Image
            src="/player-icon-yellow.svg"
            alt="yellow"
            width={80}
            height={110}
          />
        </div>
      </div>
      <div className={styles.gameTableMiddle}>
        <CircularProgressbarWithChildren
          maxValue={200}
          value={pointsRemaining}
          counterClockwise={true}
          styles={buildStyles({
            pathColor: Colors.darkBlue,
            trailColor: 'white',
          })}
        >
          <div className={styles.progressBarTextTop}>{pointsRemaining}</div>
          <div className={styles.progressBarTextBottom}>Points Left</div>
        </CircularProgressbarWithChildren>
      </div>
      <div className={styles.gameTableColumn}>
        <div className={styles.topPlayer}>
          <Image
            src="/player-icon-red.svg"
            alt="green"
            width={80}
            height={110}
          />
        </div>
        <div>
          <Image
            src="/player-icon-blue.svg"
            alt="yellow"
            width={80}
            height={110}
          />
        </div>
      </div>
    </div>
  );
};

export const GameInstructionsModal = (): ReactElement => {
  return (
    <div className={styles.instructionsText}>
      <h2>Game Instructions</h2>
      <ol>
        <li>
          Select the amount of points you will take for each round (1-10) using
          the slider or the input box.
        </li>
        <li>Click the "Take" button to receive your points.</li>
        <li>
          Points will be replenished by 10% at the end of every round. Continue
          taking points until the game is over.
        </li>
      </ol>
    </div>
  );
};
