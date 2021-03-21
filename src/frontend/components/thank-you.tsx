import { ReactElement } from 'react';
import styles from '../styles/ThankYou.module.scss';

export default function ThankYou(): ReactElement {
  return (
    <div className={styles.thankYouText}>
      Thank you for completing the game! Please exit out of this window and
      return to the Qualtrics survey.
    </div>
  );
}
