import axios from 'axios';

const fetchAPI = (options = {}) => {
  const defaultConfig = {
    method: 'get',
    timeout: 10000,
    data: null,
    url: '/',
    baseURL: 'https://devlink-backend-ra01.onrender.com/',
  };

  const axiosConfig = {
    ...defaultConfig,
    ...options,
  };

  return axios(axiosConfig);
};

export default fetchAPI;
