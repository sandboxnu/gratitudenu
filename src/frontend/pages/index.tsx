import { ReactElement } from 'react';
import styles from '../styles/Home.module.scss';

export default function Login(): ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Behavior Game</div>
      <div>
        <div className={styles.formInput}>
          <div>
            User Id
            <div className={styles.form}>
              <input placeholder="Enter Input" />
            </div>
          </div>
          <div>
            Emotion Id
            <div className={styles.form}>
              <input placeholder="Enter Input" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
