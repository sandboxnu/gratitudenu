import { ReactElement } from 'react';
import styles from '../styles/fraction.module.scss';

type FractionProps = {
  numerator: number;
  denominator: number;
};
export default function Fraction({
  numerator,
  denominator,
}: FractionProps): ReactElement {
  return (
    <div className={styles.fraction}>
      <span className={styles.numerator}>{numerator}</span>
      <span className={styles.bar}></span>
      <span className={styles.denominator}>{denominator}</span>
    </div>
  );
}
