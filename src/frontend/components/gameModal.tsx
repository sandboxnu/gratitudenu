import React, { ReactElement } from 'react';
import Modal from 'react-modal';
import EndingText from './endingText';
import styles from '../styles/GameModal.module.scss';

type GameModalProps = {
  isOpen: boolean;
  text: string | ReactElement;
};

export default function GameModal({
  isOpen,
  text,
}: GameModalProps): ReactElement {
  return (
    <Modal
      isOpen={isOpen}
      className={styles.gameModal}
      contentLabel="Instructions Modal"
    >
      {text == 'Game over' ? <EndingText /> : text}
    </Modal>
  );
}
