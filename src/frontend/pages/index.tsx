import { useRouter } from 'next/router';
import { ReactElement, useState } from 'react';
import { API } from '../api-client';
import styles from '../styles/Home.module.scss';

export default function Login(): ReactElement {
  const [userId, setUserId] = useState('');
  const [emotionId, setEmotionId] = useState('');
  const router = useRouter();

  const onContinue = async () => {
    const uId = Number.parseInt(userId);
    const eId = Number.parseInt(emotionId);
    if (isNaN(uId) || isNaN(eId)) {
      //TODO: Add error messaging
      return;
    }
    const playerId = await API.player.create({ userId: uId, emotionId: eId });
    await router.push(`/game-instructions?playerId=${playerId}`);
  };

  const updateUserId = (event) => {
    setUserId(event.target.value);
  };

  const updateEmotionId = (event) => {
    setEmotionId(event.target.value);
  };
  return (
    <div className={styles.container}>
      <div className={styles.title}>Decision Making Game</div>
      <div>
        <div className={styles.formInputs}>
          <div className={styles.formInput}>
            USER ID
            <div className={styles.form}>
              <input
                placeholder="Enter Input"
                value={userId}
                onChange={updateUserId}
              />
            </div>
          </div>
          <div className={styles.formInput}>
            ACCESS CODE
            <div className={styles.form}>
              <input
                placeholder="Enter Input"
                value={emotionId}
                onChange={updateEmotionId}
              />
            </div>
          </div>
        </div>
      </div>
      <button className="primaryButton" onClick={onContinue}>
        Continue
      </button>
    </div>
  );
}
