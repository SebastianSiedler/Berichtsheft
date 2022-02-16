import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { Store as $store } from 'src/store/index';
import { handleApiError } from './axiosErrorHandling/apiErrorMessages';
import {
  refreshAccessToken,
  signOut,
  getAccessToken,
} from 'lib/authentication/auth';
import { _axios as $api } from './axios';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface newRequestConf extends Omit<AxiosRequestConfig, 'headers'> {
  headers: {
    Authorization: string;
  };
}

interface AxiosRetryRequestConfig extends AxiosRequestConfig {
  _retry: boolean;
}

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  console.log('[request]');

  const new_config = config as newRequestConf;

  if ($store.state.auth.isAuthenticated === true) {
    new_config.headers.Authorization = `Bearer ${getAccessToken()}`;
  }

  return new_config;
};

const onRequestError = (error: AxiosError): Promise<string[]> => {
  console.error(`[request error] [${JSON.stringify(error.message)}]`);
  const errorMessage = handleApiError(error);
  return Promise.reject(errorMessage);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  console.info('[response]');
  return response;
};

/**
 * ToDo #1:
 * onResponseError hier in extra funktion handeln
 *
 * ToDo #2:
 * bei Network Error nicht abmelden!!!
 */
/*
const handleCredentialError = async (error: AxiosError) => {
  null;
};
*/
const onResponseError = async (error: AxiosError): Promise<string> => {
  console.error(`[response error] [${JSON.stringify(error.message)}]`);

  // append a retry field so we know its a retry request and avoid recursion.
  const originalRequest = error.config as AxiosRetryRequestConfig;

  // if the user is not authorized it probably means their access token has expired.
  // also check if its not a retry request
  if (
    error.response?.status === 401 &&
    originalRequest.url?.includes('api/auth/auth-jwt-refresh/')
  ) {
    signOut();
  }
  // Versucht es erneut mit neuem Token
  else if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    await refreshAccessToken();
    return $api.request(originalRequest);
  }

  const errorMessage = handleApiError(error);
  return Promise.reject(errorMessage);
};

export function setupInterceptorsTo(
  axiosInstance: AxiosInstance
): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}
