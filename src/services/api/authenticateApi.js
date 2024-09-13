import { createAsyncThunk } from '@reduxjs/toolkit';

import api from '../apiClient';
import { generateRoute, requestHeaders } from './routes';

export const authenticateUser = key => {
  return createAsyncThunk(key, (_, { getState, dispatch, rejectWithValue }) => {
    const state = getState();
    const url = generateRoute(key, state);
    const headers = requestHeaders(key, state);

    return api({
      key,
      url,
      headers
    })
      .then(response => response)
      .catch(error => {
        return rejectWithValue(error);
      });
  }).call();
};
