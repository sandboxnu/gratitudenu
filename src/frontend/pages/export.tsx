import { ReactElement, useState } from 'react';
import { CSVLink } from 'react-csv';
import { API } from '../api-client';
import styles from '../styles/Export.module.scss';

export default function Export(): ReactElement {
  const [data, setData] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitPassword = async () => {
    try {
      const exportData = await API.export.export({ password });
      setData(exportData);
      setError(null);
    } catch (e) {
      setError(e.response.data.message);
    }
  };

  return (
    <div className={styles.export}>
      {data ? (
        <button className="primaryButton">
          <CSVLink data={data} filename="game-data.csv">
            Export Study Data
          </CSVLink>
        </button>
      ) : (
        <div>
          <div className={styles.formInput}>
            Password
            <div className={styles.form}>
              <input
                placeholder="Enter Password"
                value={password}
                onChange={onPasswordChange}
              />
            </div>
          </div>
          <div className={styles.button}>
            <button className="primaryButton" onClick={onSubmitPassword}>
              Submit Password
            </button>
          </div>
          {error && <div className={styles.error}>{error}</div>}
        </div>
      )}
    </div>
  );
}
