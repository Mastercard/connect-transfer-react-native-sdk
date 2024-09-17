import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiKeys } from './apiKeys';

const BASE_URL = 'https://connect-feature.finicitystg.com/'; //  TO DO : BASE_URL stag to be replaced with Prod Later
const TEMP_BASE_URL = 'https://randomuser.me'; // TO DO : TEMP_BASE_URL to be removed with api integration story
const API_VERSION = 'v2';
const ENDPOINTS = 'deposit-switch';

// /server/connect/generate/transfer/deposit-switch //(called by partner)
// /server/authenticate/v2/transfer/deposit-switch //(called on next pressed)

// get route as per provided key from parent
export const generateRoute = (key, state) => {
  switch (key) {
    case apiKeys.authenticateUser:
      //   return `${BASE_URL}/server/authenticate/${API_VERSION}/${ENDPOINTS}`;
      return `${TEMP_BASE_URL}/api/`;
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

  if (key === apiKeys.authenticateUser) {
    headers = {
      ...headers,
      'Finicity-App-Key': state.user?.data?.appKey, // temp changes
      'Finicity-App-Token': state.user?.data?.appToken // temp changes
    };
  }
  return headers;
};

export const createApiActions = key => createAsyncThunk(key);
