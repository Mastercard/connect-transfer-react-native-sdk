import { createAsyncThunk } from '@reduxjs/toolkit';

import api from '../apiClient';
import { generateRoute } from './routes';

export const errorTranslation = key => {
  return createAsyncThunk(key, (_, { getState, rejectWithValue }) => {
    const state = getState();
    const url = generateRoute(key, state);

    return api({
      key,
      url
    })
      .then(response => response)
      .catch(error => {
        return rejectWithValue(error);
      });
  }).call();
};
