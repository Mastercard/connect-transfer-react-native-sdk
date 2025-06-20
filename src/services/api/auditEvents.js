import { createAsyncThunk } from '@reduxjs/toolkit';

import api from '../apiClient';
import { generateRoute, requestHeaders } from './routes';
import { METHODS } from '../../constants';

export const auditEvents = (key, data) => {
  return createAsyncThunk(key, (_, { getState, rejectWithValue }) => {
    const state = getState();
    const url = generateRoute(key, state);
    const headers = requestHeaders(key, state);

    return api({
      url,
      headers,
      method: METHODS.POST,
      data
    })
      .then(response => response)
      .catch(error => rejectWithValue(error));
  }).call();
};
