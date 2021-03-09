import Axios, { AxiosInstance, Method } from 'axios';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';

// Return type of array item, if T is an array
type ItemIfArray<T> = T extends (infer I)[] ? I : T;
const DEV_URL = 'http://localhost:3001/';

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
    const res = (await this.axios.request({ method, url, data: body })).data;
    return responseClass ? plainToClass(responseClass, res) : res;
  }

  player = {
    create: async (body: {
      userId: number;
      emotionId: number;
    }): // eslint-disable-next-line @typescript-eslint/ban-types
    Promise<Number> => this.req('POST', '/players', Number, body),
  };

  waitingRoom = {};

  constructor(baseURL = '') {
    this.axios = Axios.create({ baseURL: baseURL });
  }
}

export const API = new APIClient(DEV_URL);
