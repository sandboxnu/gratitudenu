import { ReactElement, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { API } from '../api-client';
import { useSetting } from '../hooks/useSetting';
import styles from '../styles/Admin.module.scss';

type AdminPageProps = {
  csvData: string;
  password: string;
};
const DEFAULT_ROUNDS = 10;
const DEFAULT_PLAYERS = 4;
const ROUND = 'ROUND';
const PLAYERS = 'PLAYERS';

function AdminPage({ csvData, password }: AdminPageProps): ReactElement {
  const settingRounds = useSetting(ROUND, DEFAULT_ROUNDS);
  const settingPlayers = useSetting(PLAYERS, DEFAULT_PLAYERS);
  const [maxRounds, setMaxRounds] = useState(10);
  const [players, setPlayers] = useState(4);
  useEffect(() => {
    setMaxRounds(settingRounds);
  }, [settingRounds]);

  useEffect(() => {
    setPlayers(settingPlayers);
  }, [settingPlayers]);

  const onRoundChange = (event) => {
    setMaxRounds(event.target.value);
  };
  const onPlayersChange = (event) => {
    setPlayers(event.target.value);
  };
  const saveSetting = (setting: string, value: number) => {
    API.settings.update({
      settingName: setting,
      value: value,
      password,
    });
  };

  return (
    <div className={styles.export}>
      <div className={styles.formInput}>
        Max Rounds:
        <div className={styles.form}>
          <input
            placeholder="Enter Max Rounds"
            value={maxRounds}
            onChange={onRoundChange}
            type="number"
          />
          <button
            className={`primaryButton ${styles.saveButton}`}
            onClick={() => saveSetting(ROUND, maxRounds)}
          >
            Save
          </button>
        </div>
      </div>
      <div className={styles.formInput}>
        Players per game:
        <div className={styles.form}>
          <input
            placeholder="Enter Players"
            value={players}
            onChange={onPlayersChange}
            type="number"
          />
          <button
            className={`primaryButton ${styles.saveButton}`}
            onClick={() => saveSetting(PLAYERS, players)}
          >
            Save
          </button>
        </div>
      </div>
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
