import { createSlice } from '@reduxjs/toolkit';

import { createApiActions } from '../../services/api/routes';
import { API_KEYS } from '../../services/api/apiKeys';
import { handleAsyncActions } from './asyncHelper';

const EN = 'en';

const initialState = {
  url: 'https://connect2.finicity.com/transfer?customerId=3012729752&language=en&origin=url&partnerId=2445582695152&signature=b17c55576eb4b6385c094e70ec424155864343b29d02fb1cc4ed36940ca93539&timestamp=1739279609161&ttl=1739366009161&type=transferDepositSwitch',
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
