import { createAsyncThunk } from '@reduxjs/toolkit';

import api from '../apiClient';
import { generateRoute, requestHeaders } from './routes';
import { METHODS } from '../apiClient/constants';
import { formatCurrentDateTime } from '../../utility/utils';

const PARTNER = 'partner';
const CONNECT_PDS = 'CONNECT_PDS';

export const termsAndPolicies = (key) => {
  return createAsyncThunk(key, (_, { getState, rejectWithValue }) => {
    const state = getState();
    const url = generateRoute(key, state);
    const headers = requestHeaders(key, state);

    return api({
      key,
      url,
      headers,
      data: getData(state.user.language),
      method: METHODS.PUT,
    })
      .then((response) => response)
      .catch((error) => {
        return rejectWithValue(error);
      });
  }).call();
};

export const getData = (language) => {
  const currentDateTime = formatCurrentDateTime();

  return {
    context: PARTNER,
    workflow: CONNECT_PDS,
    language: language,
    termsAndConditionsAcceptedDate: currentDateTime,
    privacyPolicyAcceptedDate: currentDateTime,
  };
};
