import { ReactElement } from 'react';
import styles from '../styles/EndText.module.scss';

export default function EndText(): ReactElement {
  return (
    <div className={styles.endTextContainer}>
      <div className={styles.gameOver}>GAME OVER</div>
      <div>
        Thank you for completing the game! Please exit out of this window and
        return to the Qualtrics survey.
      </div>
    </div>
  );
}
