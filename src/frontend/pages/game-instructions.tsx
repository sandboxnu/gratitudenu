import { ReactElement } from 'react';
import styles from '../styles/GameInstructions.module.scss';
import Image from 'next/image';

export default function GameInstructions(): ReactElement {
  return (
    <>
      <div className={styles.instructionsHeader}>
        Decision Making Game Instructions
      </div>
      <div className={styles.gameInstructionsContainer}>
        <div className={styles.gameInstruction}>
          You will each be assigned a color identifier.
        </div>
        <div className={styles.gameExample}>
          <Image src="/players.svg" alt="players" width={400} height={170} />
        </div>
        <div className={styles.gameInstruction}>
          You all have access to a common pool of points. The common pool starts
          with 200 points.
        </div>
        <div className={styles.gameInstruction}>
          In each round, you will decide how many points (between 0-10) to take
          for yourself from the common pool. These points will not go to the
          other players. Whatever (if any) points you do not take will be left
          in the common pool. To make sure everyone is playing at a similar
          pace, you will have up to 10 seconds to make your decision.
        </div>
        <div className={styles.gameExampleText}>
          Example: Player green makes decision.
        </div>
        <div className={styles.gameExample}>
          <Image src="/slider.svg" alt="slider" width={550} height={200} />
        </div>
        <div className={styles.gameInstruction}>
          After each round, you will see how many points were taken by the other
          team members (and vice versa).
        </div>
        <div className={styles.gameExampleText}>
          Example: Player blue and amount of points taken.
        </div>
        <div className={styles.gameExample}>
          <Image src="/points.svg" alt="points" width={180} height={200} />
        </div>
        <div className={styles.gameInstruction}>
          The total number of points taken in the round will be subtracted from
          the common pool.
        </div>
        <div className={styles.gameExampleText}>
          Example: If the total number of points taken in Round 1 is 40 points.
        </div>
        <div className={styles.gameExample}>
          <Image
            src="/pointsTaken.svg"
            alt="points taken"
            width={600}
            height={300}
          />
        </div>
        <div className={styles.gameInstruction}>
          Whatever is left in the common pool will be replenished by 10%. This
          new total will be the common pool for the next round, and each player
          will again decide how many points to take.
        </div>
        <div className={styles.gameExampleText}>
          Example: New common pool for Round 2.
        </div>
        <div className={styles.gameExample}>
          <Image
            src="/pointsReplenished.svg"
            alt="points replenished"
            width={620}
            height={300}
          />
        </div>
        <div className={styles.gameInstruction}>
          You can continue to take points as long as there are still points left
          in the common pool. If the pool drops to zero points, the game will
          end. This is a game of strategy where you will need to consider the
          amount you take out per round and how many rounds of the game will be
          played in total.
        </div>
        <div className={styles.gameInstruction}>
          When you feel that you have understood the instructions, please
          continue for a practice round.
        </div>
        <div className={styles.buttonContainer}>
          <button className="primaryButton">Continue</button>
        </div>
      </div>
    </>
  );
}
