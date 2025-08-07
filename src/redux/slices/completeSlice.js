import { createSlice } from '@reduxjs/toolkit';

import { createApiActions } from '../../services/api/routes';
import { API_KEYS } from '../../constants';
import { handleAsyncActions } from './asyncHelper';

const initialState = {
  loading: false,
  data: null,
  error: null
};

export const complete = createApiActions(API_KEYS.complete);

const completeSlice = createSlice({
  name: 'complete',
  initialState,
  extraReducers: builder => {
    handleAsyncActions(builder, complete);
  }
});

export default completeSlice.reducer;
