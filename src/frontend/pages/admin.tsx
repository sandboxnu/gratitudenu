import { ReactElement, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { API } from '../api-client';
import { useSetting } from '../hooks/useSetting';
import styles from '../styles/Admin.module.scss';

type AdminPageProps = {
  csvData: string;
  password: string;
};
const ROUND = 'ROUND';
export const PLAYERS = 'PLAYERS';
const ROUND_TIMER = 'ROUND_TIMER';
const WAITING_ROOM_TIMER = 'WAITING_ROOM_TIMER';

function AdminPage({ csvData, password }: AdminPageProps): ReactElement {
  const settingRounds = useSetting(ROUND);
  const settingPlayers = useSetting(PLAYERS);
  const settingRoundTimer = useSetting(ROUND_TIMER);
  const settingWaitingRoomTimer = useSetting(WAITING_ROOM_TIMER);

  const [maxRounds, setMaxRounds] = useState(10);
  const [players, setPlayers] = useState(4);
  const [roundTimer, setRoundTimer] = useState(15);
  const [waitingRoomTimer, setWaitingRoomTimer] = useState(180);

  useEffect(() => {
    if (settingRounds) {
      setMaxRounds(settingRounds);
    }
  }, [settingRounds]);

  useEffect(() => {
    if (settingPlayers) {
      setPlayers(settingPlayers);
    }
  }, [settingPlayers]);

  useEffect(() => {
    if (settingRoundTimer) {
      setRoundTimer(settingRoundTimer);
    }
  }, [settingRoundTimer]);

  useEffect(() => {
    if (settingWaitingRoomTimer) {
      setWaitingRoomTimer(settingWaitingRoomTimer / 1000);
    }
  }, [settingWaitingRoomTimer]);

  const onRoundChange = (event) => {
    setMaxRounds(event.target.value);
  };
  const onPlayersChange = (event) => {
    setPlayers(event.target.value);
  };

  const onRoundTimerChange = (event) => {
    if (event.target.value > 0 && event.target.value < 25) {
      setRoundTimer(event.target.value);
    }
  };
  const onWaitingRoomTimerChange = (event) => {
    setWaitingRoomTimer(event.target.value);
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
        Max rounds:
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
      <div className={styles.formInput}>
        Round length (in seconds):
        <div className={styles.form}>
          <input
            placeholder="Round Length in Seconds"
            value={roundTimer}
            onChange={onRoundTimerChange}
            type="number"
          />
          <button
            className={`primaryButton ${styles.saveButton}`}
            onClick={() => saveSetting(ROUND_TIMER, roundTimer)}
          >
            Save
          </button>
        </div>
      </div>
      <div className={styles.formInput}>
        Waiting Room Length (in seconds):
        <div className={styles.form}>
          <input
            placeholder="Waiting Room Length in Seconds"
            value={waitingRoomTimer}
            onChange={onWaitingRoomTimerChange}
            type="number"
          />
          <button
            className={`primaryButton ${styles.saveButton}`}
            onClick={() =>
              saveSetting(WAITING_ROOM_TIMER, waitingRoomTimer * 1000)
            }
          >
            Save
          </button>
        </div>
      </div>
      <button className={`primaryButton ${styles.exportButton}`}>
        <CSVLink data={csvData} filename="game-data.csv">
          Export Study Data
        </CSVLink>
      </button>
    </div>
  );
}

export default function Admin(): ReactElement {
  const [data, setData] = useState(null);
  const [dataReturnedWithoutError, setDataReturnedWithoutError] = useState(
    false,
  );
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
      setDataReturnedWithoutError(true);
    } catch (e) {
      setError(e.response.data.message);
      setDataReturnedWithoutError(false);
    }
  };

  return (
    <div className={styles.export}>
      {dataReturnedWithoutError ? (
        <AdminPage csvData={data} password={password} />
      ) : (
        <div className={styles.pageContainer}>
          <div className={styles.formInput}>
            Password
            <div className={styles.form}>
              <input
                type="password"
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
