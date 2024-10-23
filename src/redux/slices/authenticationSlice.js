import { createSlice } from '@reduxjs/toolkit';

import { createApiActions } from '../../services/api/routes';
import { apiKeys } from '../../services/api/apiKeys';
import { handleAsyncActions } from './asyncHelper';

const EN_US = 'en-US';

const initialState = {
  baseURL: '',
  queryParams: '',
  queryParamsObject: {},
  language: EN_US, // Default language
  loading: false,
  data: null,
  error: null
};

export const authenticateUser = createApiActions(apiKeys.authenticateUser);

const authenticationSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUrlData: (state, action) => {
      const { baseURL, queryParams, queryParamsObject } = action.payload;

      state.baseURL = baseURL;
      state.queryParams = queryParams;
      state.queryParamsObject = queryParamsObject;
      state.language = queryParamsObject?.language || EN_US;
    }
  },
  extraReducers: builder => {
    handleAsyncActions(builder, authenticateUser);
  }
});

export const { setUrlData } = authenticationSlice.actions;
export default authenticationSlice.reducer;
