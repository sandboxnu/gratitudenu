import { ReactElement, useState } from 'react';
import { API } from '../api-client';
import styles from '../styles/Home.module.scss';

export default function Login(): ReactElement {
  const [userId, setUserId] = useState(null);
  const [emotionId, setEmotionId] = useState(null);

  const onContinue = async () => {
    const playerId = await API.player.create({ userId, emotionId });
    console.log(playerId);
  };
  return (
    <div className={styles.container}>
      <div className={styles.title}>Behavior Game</div>
      <div>
        <div className={styles.formInput}>
          <div>
            USER ID
            <div className={styles.form}>
              <input placeholder="Enter Input" value={} />
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
