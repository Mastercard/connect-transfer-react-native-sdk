import axios from 'axios';

import { METHODS, TIMEOUT } from './constants';
import { requestHeaders } from '../api/routes';

// options can contain the following arguments:
// key, url, data, headers, method, timeout etc
export const api = options => {
  const {
    key,
    url,
    data,
    headers = requestHeaders(key, state),
    method = METHODS.GET,
    timeout = TIMEOUT
  } = options;
  const dataOrParams = method === METHODS.GET ? 'params' : 'data';

  return axios({
    url,
    method,
    headers,
    [dataOrParams]: data,
    timeout
  })
    .then(response => response.data)
    .catch(error => error && Promise.reject(error));
};

export default api;
