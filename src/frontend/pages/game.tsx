import Head from 'next/head';
import styles from '../styles/Game.module.scss';
import Slider from 'react-input-slider';
import Modal from 'react-modal';
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gameConstants from '../constants/gameConstants';
import Colors from '../constants/colorConstants';
import Timer from '../components/timer';

/**
 * TODO HIGH LEVEL
 * add documentation for Home react element function
 * make all the alerts into clean notifications
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
  const [takeVal, setTakeVal] = useState<number>(gameConstants.MIN_TAKE_VAL);
  const TIMER_SECONDS = 10;
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [playerColor, setPlayerColor] = useState<string>(
    gameConstants.DEFAULT_COLOR,
  );
  const [playerCoins, setPlayerCoins] = useState<number>(
    gameConstants.INIT_PLAYER_COINS,
  );

  const handleTake = (event) => {
    event.preventDefault();
    alert(`you took ${takeVal} coins!`);
  };

  const inputOnChange = (eventVal: string) => {
    const intVal = parseInt(eventVal);

    // TODO: You can't type a '-', not sure we need this first condition
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

  // RETURN HERE
  return (
    <div className={styles.container}>
      <Head>
        <title>RDG NU | Game Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
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
          <GameTable takeVal={takeVal} />
          <Timer
            time={TIMER_SECONDS}
            shouldResetTimer
            onTimerOver={() => setTakeVal(Math.floor(Math.random() * 11))}
            customClass={styles.gameTimer}
          />
        </div>

        <div className={styles.actionBar}>
          <div className={styles.actionBarLeft}>
            {/* TODO: both of these values will be given by an API/socket */}
            <h4 className={styles.actionBarText}>
              You Are:{' '}
              <span style={{ color: playerColor.toLowerCase() }}>
                {playerColor}{' '}
              </span>
            </h4>
            <h4 className={styles.actionBarText}>
              Your Total Coins:{' '}
              <span style={{ color: Colors.darkPurple }}>{playerCoins} </span>
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
            <button className={styles.actionBarTake} onClick={handleTake}>
              Take
            </button>
            {/* TODO: add socket send here */}
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
  takeVal: number;
}

const GameTable = ({ takeVal }: GameTableProps): ReactElement => {
  const [totalPointsLeft, setTotalPointsLeft] = useState(200);
  const didMountRef = useRef(false); // Don't take points on first render

  useEffect(() => {
    if (didMountRef.current) {
      setTotalPointsLeft(totalPointsLeft - takeVal);
    } else {
      didMountRef.current = true;
    }
  }, [takeVal]);

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
          value={totalPointsLeft}
          counterClockwise={true}
          styles={buildStyles({
            pathColor: Colors.darkBlue,
            trailColor: 'white',
          })}
        >
          <div className={styles.progressBarTextTop}>{totalPointsLeft}</div>
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
