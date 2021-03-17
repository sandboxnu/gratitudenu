import { ReactElement } from 'react';
import { CSVLink, CSVDownload } from 'react-csv';

export default function Export(): ReactElement {
  const csvData = [
    ['firstname', 'lastname', 'email'],
    ['Ahmed', 'Tomi', 'ah@smthing.co.com'],
    ['Raed', 'Labes', 'rl@smthing.co.com'],
    ['Yezzi', 'Min l3b', 'ymin@cocococo.com'],
  ];

  const formatData = [
    { game: 1, emotionId: 1, rounds: [{ round: 1, player: 'a' }] },
    { game: 1, emotionId: 1, rounds: [{ round: 1, player: 'a' }] },
  ];

  return (
    <div>
      Yeet
      <CSVLink data={formatData}>Download me</CSVLink>;
    </div>
  );
}
