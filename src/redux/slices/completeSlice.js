import { createSlice } from '@reduxjs/toolkit';

import { createApiActions } from '../../services/api/routes';
import { apiKeys } from '../../services/api/apiKeys';
import { handleAsyncActions } from './asyncHelper';

const initialState = {
  loading: false,
  data: null,
  error: null
};

export const complete = createApiActions(apiKeys.complete);

const completeSlice = createSlice({
  name: 'complete',
  initialState,
  extraReducers: builder => {
    handleAsyncActions(builder, complete);
  }
});

export default completeSlice.reducer;
