// Imports
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

interface fetchAPIOptions {
  method?: AxiosRequestConfig['method'];
  timeout?: number;
  data?: Record<string, any>;
  url?: string;
  baseURL?: string;
  token?: string;
}

// Utility function to make API requests with customizable options
const fetchAPI = (options: fetchAPIOptions = {}): Promise<AxiosResponse> => {

  const defaultConfig: AxiosRequestConfig = {
    method: 'get',
    timeout: 5000, 
    data: {}, 
    url: '/', 
    baseURL: 'http://localhost:8000/',
  };
  
  // Convert data object to URL-encoded form format
  const formData = new URLSearchParams(options.data).toString();
  // console.log('formData indexJs', formData); 
  
  // Merge default config with provided options and set headers for auth
  const axiosConfig: AxiosRequestConfig = {
    ...defaultConfig,
    ...options,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', 
      ...(options.token ? { Authorization: 'Bearer ' + options.token } : {}), 
    },
    data: formData, 
  };
  
  // Execute the API request using axios
  return axios(axiosConfig);
};

export { fetchAPI };