import Head from 'next/head';
import styles from '../styles/Game.module.css';
import Slider from 'react-input-slider';
import {
  buildStyles,
  CircularProgressbarWithChildren,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import React, { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [takeVal, setTakeVal] = useState(10);

  const inputOnChange = (eventVal) => {
    const intVal = parseInt(eventVal);

    // TODO: You actually can't type a '-', not sure we need this first condition
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
        <div className={styles.infoSection}>Info Section Here</div>

        <div className={styles.gameDisplay}>
          <GameTable />
          <div>Timer</div>
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
              type="number"
              value={takeVal}
              onChange={(event) => {
                inputOnChange(event.target.value);
              }}
              min="0"
              max="10"
            />
            <Slider
              axis="x"
              x={takeVal}
              onChange={({ x }) => setTakeVal(x)}
              styles={{}}
              className={styles.slider}
              xmax={10}
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

const GameTable = () => {
  const [totalPointsLeft, setTotalPointsLeft] = useState(200);

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
