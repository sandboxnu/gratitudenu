import React, { ReactElement, useEffect, useState } from 'react';
import gameConstants from '../constants/gameConstants';
import { useRouter } from 'next/dist/client/router';
import styles from '../styles/Game.module.scss';
import Head from 'next/head';
import GameModal from '../components/gameModal';
import Image from 'next/image';
import Modal from 'react-modal';
import Colors from '../constants/colorConstants';
import Slider from 'react-input-slider';
import { GameTable } from './game';

export default function PracticeGame(): ReactElement {
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

  const handleTake = () => {
    if (!takeComplete) {
      setTakeComplete(true);
      setPlayerPoints(playerPoints + takeVal);
    }
  };

  useEffect(() => {
    const interval = setInterval(
      () => setTimeLeft((timeLeft) => (timeLeft === 0 ? 0 : timeLeft - 1)),
      1000,
    );

    return () => clearInterval(interval);
  }, [timeLeft]);

  if (timeLeft === 0) {
    if (!takeComplete) {
      handleTake();
    }
    // Take random number of points from pot
    setPointsRemaining(
      pointsRemaining - (takeVal + 3 * Math.floor(Math.random() * 9)),
    );
    setRoundNumber(roundNumber + 1);
    setGameOverModalIsOpen(roundNumber >= 3);
    setTimeLeft(gameConstants.INIT_TIME_LEFT);
    setTakeComplete(false);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>RDG NU | Game Page</title>
        <link rel="icon" href="/favicon.ico" />
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
                transform: 'translate(-50%, -50%)',
              },
            }}
            contentLabel="Instructions Modal"
          >
            Game instruction summary
          </Modal>
        </div>

        <div className={styles.gameDisplay}>
          <GameTable pointsRemaining={pointsRemaining} />
          <div className={styles.timer}>{timeLeft}</div>
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
