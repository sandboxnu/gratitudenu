import Head from 'next/head';
import styles from '../styles/Game.module.css';
import Slider from 'react-input-slider';
import Modal from 'react-modal';
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const MAX_TAKE_VAL = 10;
const INIT_TIME_LEFT = 10;

export default function Home(): ReactElement {
  const [takeVal, setTakeVal] = useState(MAX_TAKE_VAL);
  const [timeLeft, setTimeLeft] = useState(INIT_TIME_LEFT);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(
      () => setTimeLeft((timeLeft) => timeLeft - 1),
      1000,
    );

    return () => clearInterval(interval);
  }, [timeLeft]);

  if (timeLeft === 0) {
    setTakeVal(Math.floor(Math.random() * 11));
    setTimeLeft(10);
  }

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
          <div className={styles.timer}>{timeLeft}</div>
        </div>

        <div className={styles.actionBar}>
          <div className={styles.actionBarLeft}>
            {/* TODO: both of these values will be given by an API/socket */}
            <h4>You Are: </h4>
            <h4>Current Coins: </h4>
          </div>
          <div className={styles.actionBarMiddle}>
            <button> Take</button>
            {/* TODO: add socket send here */}
          </div>
          <div className={styles.actionBarRight}>
            <input
              className={styles.inputBox}
              type="number"
              value={takeVal}
              onChange={(event) => {
                inputOnChange(event.target.value);
              }}
              min="0"
              max={MAX_TAKE_VAL}
            />
            <Slider
              axis="x"
              x={takeVal}
              onChange={({ x }) => setTakeVal(x)}
              xmax={MAX_TAKE_VAL}
            />
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
            pathColor: '#002A52',
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
