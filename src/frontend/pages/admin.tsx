import { ReactElement, useState } from 'react';
import { CSVLink } from 'react-csv';
import { API } from '../api-client';
import styles from '../styles/Admin.module.scss';

type AdminPageProps = {
  csvData: string;
  password: string;
};

function AdminPage({ csvData, password }: AdminPageProps): ReactElement {
  const [maxRounds, setMaxRounds] = useState();
  return (
    <div className={styles.export}>
      <div className={styles.formInput}>
        Max Rounds:
        <div className={styles.form}>
          <input
            placeholder="Enter Max Rounds"
            value={password}
            type="number"
          />
        </div>
      </div>
      {/* <div className={styles.formInput}>
        Max Players:
        <div className={styles.form}>
          <input placeholder="Enter Password" value={password} />
        </div>
      </div> */}
      <button className="primaryButton">
        <CSVLink data={csvData} filename="game-data.csv">
          Export Study Data
        </CSVLink>
      </button>
    </div>
  );
}

export default function Admin(): ReactElement {
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
        <AdminPage csvData={data} password={password} />
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
