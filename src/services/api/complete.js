import { createAsyncThunk } from '@reduxjs/toolkit';

import api from '../apiClient';
import { generateRoute, requestHeaders } from './routes';
import { METHODS } from '../apiClient/constants';

export const complete = key => {
  return createAsyncThunk(key, (_, { getState, rejectWithValue }) => {
    const state = getState();
    const url = generateRoute(key, state);
    const headers = requestHeaders(key, state);
    const data = { reportData: [] };

    return api({
      key,
      url,
      headers,
      data,
      method: METHODS.POST
    })
      .then(response => response)
      .catch(error => {
        return rejectWithValue(error);
      });
  }).call();
};
