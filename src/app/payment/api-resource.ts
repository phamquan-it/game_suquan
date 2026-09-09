import axios, { AxiosRequestConfig } from "axios";
import { SepayConfig } from "./types/types";
import { SePayPgClient } from "./types/client";

export class ApiResource {
  constructor(private config: SepayConfig) {
    if (!config) {
      throw new Error('SepayConfig is required');
    }
  }

  makeHttpRequest(method: string, endpoint: string, options?: AxiosRequestConfig) {
    return axios({
      method,
      url: `${SePayPgClient.baseApiUrl}/${endpoint}`,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${this.config.merchant_id}:${this.config.secret_key}`)}`,
      },
    })
  }
}
