import Axios, { AxiosRequestConfig } from 'axios';

//API Requests with Axios.
//Functions that call the backend API use this method
export async function apiRequest<D = Record<string, unknown>, R = unknown>(
  method: 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch',
  path: string,
  input?: D,
  options?: AxiosRequestConfig,
  // options?: {
  //   headers?: AxiosRequestHeaders
  // } & AxiosRequestConfig,
) {
  try {
    const response = await Axios.request<R>({
      baseURL: process.env.REACT_APP_API_URL,
      url: path,
      method: method,
      data: input,
      headers: options?.headers,
      withCredentials: true,
    });
    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return error.response;
  }
}

export * from './User';
