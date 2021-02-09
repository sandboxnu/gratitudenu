import Head from 'next/head';
import styles from '../styles/Game.module.css';
import Slider from 'react-input-slider';
import React, { useState } from 'react';

export default function Home() {
  const [sliderVal, setSliderVal] = useState(10);

  function inputPress(event) {
    console.log(sliderVal);
    //
    if (
      !(event.charCode <= 57 || (event.charCode >= 96 && event.charCode <= 105))
    ) {
      alert('Inputs Must Be Between 0-9!');
    }

    if (sliderVal * 10 + event.target.value > 10) {
      alert('Take Value Must Be Between 0 and 10!');
      //! note this if statement still allows the keypress to go through after we alert
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>RDG NU</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* <h1 className={styles.title}>Game Page</h1> */}
        <div className={styles.infosection}>Info Section Here</div>
        <div className={styles.gametable}>Game Table Image will be here</div>
        <div className={styles.actionbar}>
          <div className={styles.actionbarleft}>
            {/* TODO: both of these values will be given by an API/socket */}
            <h4>You Are: </h4>
            <h4>Current Coins: </h4>
          </div>
          <div className={styles.actionbarmiddle}>
            <button> Take </button>
            {/* TODO: add socket send here */}
          </div>
          <div className={styles.actionbarright}>
            <input
              type="number"
              value={sliderVal}
              onChange={(event) => {
                setSliderVal(event.target.value);
              }}
              onKeyPress={(event) => {
                inputPress(event);
              }}
              min="0"
              max="10"
            ></input>
            <Slider
              axis="x"
              x={sliderVal}
              onChange={({ x }) => setSliderVal(x)}
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
