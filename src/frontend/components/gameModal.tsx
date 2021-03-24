import React, { ReactElement } from 'react';
import Modal from 'react-modal';

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
      style={{
        content: {
          minWidth: '300px',
          minHeight: '100px',
          fontSize: '64px',
          textAlign: 'center',
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
      contentLabel="Instructions Modal"
    >
      {text}
    </Modal>
  );
}
