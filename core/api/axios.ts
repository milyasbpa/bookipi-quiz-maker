import axios, { type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use hardcoded Bearer token for Quiz Maker backend
axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = 'Bearer dev-token';
  return config;
});

if (process.env.NODE_ENV === 'development') {
  axiosInstance.interceptors.request.use((config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data ?? '');
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`[API] ${response.status} ${response.config.url}`, response.data);
      return response;
    },
    (error: AxiosError) => {
      if (axios.isCancel(error)) return Promise.reject(error);
      console.error(`[API] Error ${error.response?.status} ${error.config?.url}`, error.message);
      return Promise.reject(error);
    },
  );
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 403) {
      console.warn('[API] 403 Forbidden — insufficient permissions');
    }

    if (status && status >= 500) {
      console.error('[API] Server error', status, error.config?.url);
    }

    return Promise.reject(error);
  },
);

// Orval mutator — unwraps data from the Axios response
export const axiosInstanceMutator = <T>(config: AxiosRequestConfig): Promise<T> =>
  axiosInstance(config).then(({ data }) => data as T);
