import useSWR from 'swr';
import { API } from '../api-client';

type Hook = (settingName: string) => number;

export const useSetting: Hook = (settingName: string) => {
  const { data } = useSWR(`/admin?settingName=${settingName}`, async () =>
    API.settings.get(settingName),
  );

  return data?.valueOf();
};
