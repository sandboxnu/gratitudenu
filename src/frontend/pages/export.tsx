import { ReactElement } from 'react';
import useSWR from 'swr';
import { CSVLink } from 'react-csv';
import { API } from '../api-client';
import styles from '../styles/Export.module.scss';

export default function Export(): ReactElement {
  const { data } = useSWR(`export`, async () => API.export.export());

  return (
    <div className={styles.export}>
      {data && (
        <button className="primaryButton">
          <CSVLink data={data} filename="game-data.csv">
            Download me
          </CSVLink>
        </button>
      )}
    </div>
  );
}
