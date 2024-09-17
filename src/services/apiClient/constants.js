export const TIMEOUT = 60 * 1000; // request timeout TBD

export const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS'
};

export const ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  ACCESS_DENIED: 403,
  NOT_FOUND: 404,
  PASSWORD_FIELD_EMPTY: 1001,
  NOT_MODIFIED: 304,
  SERVICE_UNAVAILABLE: 503,
  NO_NETWORK: 'ERR_NETWORK'
};

export const REQUEST_HEADER_TYPE = {
  HTML: 'html',
  JSON: 'json'
};
