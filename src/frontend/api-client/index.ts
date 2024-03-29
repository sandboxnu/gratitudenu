import Axios, { AxiosInstance, Method } from 'axios';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

// Return type of array item, if T is an array
type ItemIfArray<T> = T extends (infer I)[] ? I : T;
export const API_URL = process.env.NEXT_PUBLIC_GRATITUDE_API_URL
  ? process.env.NEXT_PUBLIC_GRATITUDE_API_URL
  : 'http://localhost:3001';

class APIClient {
  private axios: AxiosInstance;

  /**
   * Send HTTP and return data, optionally serialized with class-transformer (helpful for Date serialization)
   * @param method HTTP method
   * @param url URL to send req to
   * @param responseClass Class with class-transformer decorators to serialize response to
   * @param body body to send with req
   */
  private async req<T>(
    method: Method,
    url: string,
    responseClass?: ClassType<ItemIfArray<T>>,
    body?: any,
  ): Promise<T>;
  private async req<T>(
    method: Method,
    url: string,
    responseClass?: ClassType<T>,
    body?: any,
  ): Promise<T> {
    const res = (
      await this.axios.request({
        method,
        url,
        data: body,
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
    ).data;
    return responseClass ? plainToClass(responseClass, res) : res;
  }

  player = {
    create: async (body: {
      userId: number;
      emotionId: number;
    }): // eslint-disable-next-line @typescript-eslint/ban-types
    Promise<Number> => {
      return this.req('POST', '/players', Number, body);
    },
  };

  game = {
    take: async (body: {
      playerId: number;
      howMany: number;
      timeTaken: number;
      roundNumber: number;
    }): // eslint-disable-next-line @typescript-eslint/ban-types
    Promise<Number> => {
      return this.req('POST', '/game/take', Number, body);
    },
  };

  export = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    export: async (body: { password: string }): Promise<String> => {
      return this.req('POST', '/export', String, body);
    },
  };

  settings = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    get: async (settingName: string): Promise<Number> => {
      return this.req('GET', `/admin?settingName=${settingName}`, Number);
    },

    update: async (body: {
      settingName: string;
      value: number;
      password: string;
    }): // eslint-disable-next-line @typescript-eslint/ban-types
    Promise<Number> => {
      return this.req('PATCH', `/admin/setting`, Number, body);
    },
  };

  constructor(baseURL = '') {
    this.axios = Axios.create({ baseURL: baseURL });
  }
}

export const API = new APIClient(API_URL);
