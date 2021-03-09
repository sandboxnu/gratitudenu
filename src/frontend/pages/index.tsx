import { ReactElement } from 'react';
import styles from '../styles/Home.module.scss';

export default function Login(): ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.title}>Behavior Game</div>
      <div>
        <div className={styles.formInput}>
          <div>
            USER ID
            <div className={styles.form}>
              <input placeholder="Enter Input" />
            </div>
          </div>
          <div>
            EMOTION ID
            <div className={styles.form}>
              <input placeholder="Enter Input" />
            </div>
          </div>
        </div>
      </div>
      <button className="primaryButton">Continue</button>
    </div>
  );
}
