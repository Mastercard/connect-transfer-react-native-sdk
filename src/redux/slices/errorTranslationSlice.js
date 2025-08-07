import { createSlice } from '@reduxjs/toolkit';

import { createApiActions } from '../../services/api/routes';
import { API_KEYS } from '../../constants';
import { handleAsyncActions } from './asyncHelper';

const initialState = {
  loading: false,
  data: null,
  error: null
};

export const errorTranslation = createApiActions(API_KEYS.errorTranslation);

const errorTranslationSlice = createSlice({
  name: 'errorTranslation',
  initialState,
  extraReducers: builder => {
    handleAsyncActions(builder, errorTranslation);
  }
});

export default errorTranslationSlice.reducer;
