import React, { ReactElement } from 'react';
import Modal from 'react-modal';
import styles from '../styles/GameModal.module.scss';

type GameModalProps = {
  isOpen: boolean;
  text: string;
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
      {text}
    </Modal>
  );
}
