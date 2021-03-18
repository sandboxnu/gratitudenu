import { ReactElement } from 'react';
import useSWR from 'swr';
import { CSVLink } from 'react-csv';
import { API } from '../api-client';

export default function Export(): ReactElement {
  const { data } = useSWR(`export`, async () => API.export.export());

  console.log(data);

  return (
    <div>
      <button>
        <CSVLink data={data} filename="game-data.csv">
          Download me
        </CSVLink>
      </button>
    </div>
  );
}
