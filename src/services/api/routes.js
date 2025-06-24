import { createAsyncThunk } from '@reduxjs/toolkit';

import { API_KEYS, WEBPAGE_API_KEYS, HEADERS, DEFAULT_LANGUAGE_EN } from '../../constants';

const FINICITY_BASE_URL = 'https://www.finicity.com/';
const CONNECT_BASE_URL = 'https://connect2.finicity.com';
const API_VERSION = 'v2';
const APPLICATION_ID = 'connect-mobile-sdk';

// Generate route based on the provided key
export const generateRoute = (key, state) => {
  const {
    baseURL = '',
    queryParams = '',
    language = DEFAULT_LANGUAGE_EN,
    data,
    queryParamsObject
  } = state?.user || {};
  const { endpoint = '' } = data?.auditServiceDetails || {};
  const { partnerId = '', customerId = '' } = queryParamsObject || {};

  switch (key) {
    case API_KEYS.authenticateUser:
      return `${baseURL}/server/authenticate/${API_VERSION}/transfer/deposit-switch${queryParams}`;

    case API_KEYS.errorTranslation:
      return `${baseURL}/transfer/assets/i18n/errors/${language}.json`;

    case API_KEYS.auditEvents:
      return `${endpoint}/partners/${partnerId}/customers/${customerId}/events`;

    case API_KEYS.termsAndPolicies:
      return `${baseURL}/server/terms-and-policies`;

    case API_KEYS.complete:
      return `${baseURL}/server/auto/${API_VERSION}/complete`;

    case WEBPAGE_API_KEYS.privacy_EN:
      return `${FINICITY_BASE_URL}/privacy`;

    case WEBPAGE_API_KEYS.privacy_ES:
      return `${FINICITY_BASE_URL}/privacy/es/`;

    case WEBPAGE_API_KEYS.termsOfUse_EN:
      return `${CONNECT_BASE_URL}/assets/html/connect-eula.html`;

    case WEBPAGE_API_KEYS.termsOfUse_ES:
      return `${CONNECT_BASE_URL}/assets/html/connect-eula_es.html`;

    default:
      return null;
  }
};

export const requestHeaders = (key, state) => {
  let headers = { ...HEADERS };
  const { token = '', auditServiceDetails = {} } = state.user?.data || {};

  switch (key) {
    case API_KEYS.termsAndPolicies:
    case API_KEYS.complete:
      headers = {
        ...headers,
        authorization: `Bearer ${token}`
      };
      break;

    case API_KEYS.auditEvents:
      headers = {
        ...headers,
        Token: auditServiceDetails?.token,
        'application-id': APPLICATION_ID
      };
      break;

    default:
      break;
  }

  return headers;
};

export const createApiActions = key => createAsyncThunk(key);
