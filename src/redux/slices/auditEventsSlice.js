import { createSlice } from '@reduxjs/toolkit';

import { createApiActions } from '../../services/api/routes';
import { API_KEYS } from '../../services/api/apiKeys';
import { handleAsyncActions } from './asyncHelper';

const initialState = {
  loading: false,
  data: null,
  error: null
};

export const auditEvents = createApiActions(API_KEYS.auditEvents);

const auditEventsSlice = createSlice({
  name: 'auditEvents',
  initialState,
  extraReducers: builder => {
    handleAsyncActions(builder, auditEvents);
  }
});

export default auditEventsSlice.reducer;
