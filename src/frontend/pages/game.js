import Head from 'next/head';
import styles from '../styles/Game.module.css';
import Slider from 'react-input-slider';
import React, { useState } from 'react';

export default function Home() {
  const [takeVal, setTakeVal] = useState(10);
  // state variable to track which color this user is once we hook this up to back end this will be dynamic
  const [thisColor, setThisColor] = useState('Green');
  // state variable to track how many coins this user has, once we hook this up to back end this will be dynamic
  const [theseCoins, setTheseCoins] = useState(0);

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

  const handleTake = (event) => {
    event.preventDefault();
    alert('you took ' + theseCoins + ' coins!');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>RDG NU | Game Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.infoSection}>Info Section Here</div>
        <div className={styles.gameTable}>Game Table Image will be here</div>
        <div className={styles.actionBar}>
          <div className={styles.actionBarLeft}>
            {/* TODO: both of these values will be given by an API/socket */}
            {/* TODO: add some JS to change styling of the color based on what color it is  */}
            <h4 className={styles.actionBarText}>
              You Are: <span style={{ color: 'green' }}>{thisColor} </span>
            </h4>
            <h4 className={styles.actionBarText}>
              Current Coins:{' '}
              <span style={{ color: '#546ec9' }}>{theseCoins} </span>
            </h4>
          </div>
          <div className={styles.actionBarMiddle}>
            <input
              type="number"
              value={takeVal}
              onChange={(event) => {
                inputOnChange(event.target.value);
              }}
              min="0"
              max="10"
              className={styles.actionBarInput}
            />
            <Slider
              axis="x"
              x={takeVal}
              onChange={({ x }) => setTakeVal(x)}
              styles={{
                active: {
                  backgroundColor: '#002a52',
                },
                thumb: {
                  backgroundColor: '#546ec9',
                },
              }}
              className={styles.slider}
              xmax={10}
            />
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
