import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiKeys, webViewApiKeys } from './apiKeys';

const FINICITY_BASE_URL = 'https://www.finicity.com/';
const CONNECT_BASE_URL = 'https://connect2.finicity.com';
const API_VERSION = 'v2';

// Generate route based on the provided key
export const generateRoute = (key, state) => {
  const { baseURL, queryParams } = state.user;

  switch (key) {
    case apiKeys.authenticateUser:
      return `${baseURL}/server/authenticate/${API_VERSION}/transfer/deposit-switch${queryParams}`;

    case apiKeys.termsAndPolicies:
      return `${baseURL}/server/terms-and-policies`;

    case apiKeys.complete:
      return `${baseURL}/server/auto/${API_VERSION}/complete`;

    case webViewApiKeys.privacy_EN:
      return `${FINICITY_BASE_URL}/privacy`;

    case webViewApiKeys.privacy_ES:
      return `${FINICITY_BASE_URL}/privacy/es/`;

    case webViewApiKeys.termsOfUse_EN:
      return `${CONNECT_BASE_URL}/assets/html/connect-eula.html`;

    case webViewApiKeys.termsOfUse_ES:
      return `${CONNECT_BASE_URL}/assets/html/connect-eula_es.html`;

    default:
      return null;
  }
};

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

export const requestHeaders = (key, state) => {
  let headers = { ...DEFAULT_HEADERS };

  switch (key) {
    case apiKeys.termsAndPolicies:
    case apiKeys.complete:
      headers = {
        ...headers,
        authorization: `Bearer ${state.user?.data?.token}`
      };
      break;

    default:
      break;
  }

  return headers;
};

export const createApiActions = key => createAsyncThunk(key);
