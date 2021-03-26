import useSWR from 'swr';
import { API } from '../api-client';

type Hook = (settingName: string, defaultValue: number) => number;

export const useSetting: Hook = (settingName: string, defaultValue: number) => {
  const { data, error } = useSWR(
    `/admin?settingName=${settingName}`,
    async () => API.settings.get(settingName),
  );
  console.log(data);
  if (data) {
    return data.valueOf();
  }

  return defaultValue;
};
