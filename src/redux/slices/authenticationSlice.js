import { createSlice } from '@reduxjs/toolkit';

import { createApiActions } from '../../services/api/routes';
import { API_KEYS } from '../../services/api/apiKeys';
import { handleAsyncActions } from './asyncHelper';

const EN = 'en';

const initialState = {
  url: '',
  baseURL: '',
  queryParams: '',
  queryParamsObject: {},
  language: EN, // Default language
  loading: false,
  data: { data: null },
  error: null
};

export const authenticateUser = createApiActions(API_KEYS.authenticateUser);

const authenticationSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUrl: (state, action) => {
      state.url = action.payload;
    },
    setUrlData: (state, action) => {
      const { baseURL, queryParams, queryParamsObject } = action.payload;

      state.baseURL = baseURL;
      state.queryParams = queryParams;
      state.queryParamsObject = queryParamsObject;
      state.language = queryParamsObject?.language || EN;
    }
  },
  extraReducers: builder => {
    handleAsyncActions(builder, authenticateUser);
  }
});

export const { setUrl, setUrlData } = authenticationSlice.actions;
export default authenticationSlice.reducer;
