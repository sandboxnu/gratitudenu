import { ReactElement } from 'react';
import styles from '../styles/ThankYou.module.scss';

export default function TimeOut(): ReactElement {
  return (
    <div className={styles.messageContainer}>
      <div className={styles.timeOutMessage}>
        Unfortunately, we were unable to find other players to begin the game at
        this time.
      </div>
      <div className={styles.timeOutMessage}>
        Please return to Qualtrics and try again.
      </div>
    </div>
  );
}
