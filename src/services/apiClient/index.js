import axios from 'axios';

import { METHODS, TIMEOUT } from '../../constants';

// options can contain the following arguments:
// url, data, headers, method, timeout, signal etc
export const api = options => {
  const { url, data, headers, method = METHODS.GET, timeout = TIMEOUT, signal } = options;

  const dataOrParams = method === METHODS.GET ? 'params' : 'data';

  return axios({
    url,
    method,
    headers,
    [dataOrParams]: data,
    timeout,
    signal
  })
    .then(response => response?.data)
    .catch(error => error && Promise.reject(error));
};

export default api;
