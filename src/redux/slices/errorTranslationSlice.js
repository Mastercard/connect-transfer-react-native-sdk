import { createSlice } from '@reduxjs/toolkit';

import { createApiActions } from '../../services/api/routes';
import { API_KEYS } from '../../services/api/apiKeys';
import { handleAsyncActions } from './asyncHelper';

const initialState = {
  loading: false,
  data: null,
  error: null
};

export const errorTranslation = createApiActions(API_KEYS.errorTranslation);

const errorTranslationSlice = createSlice({
  name: 'errorTranslationSlice',
  initialState,
  extraReducers: builder => {
    handleAsyncActions(builder, errorTranslation);
  }
});

export default errorTranslationSlice.reducer;
