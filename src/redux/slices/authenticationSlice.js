import { createSlice } from '@reduxjs/toolkit';

import { createApiActions } from '../../services/api/routes';
import { API_KEYS } from '../../services/api/apiKeys';
import { handleAsyncActions } from './asyncHelper';

const EN = 'en';

const initialState = {
  modalVisible: false,
  url: '',
  baseURL: '',
  queryParams: '',
  queryParamsObject: {},
  language: EN, // Default language
  loading: false,
  data: null,
  error: null
};

export const authenticateUser = createApiActions(API_KEYS.authenticateUser);

const authenticationSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setModalVisible: state => {
      state.modalVisible = true;
    },
    setUrl: (state, action) => {
      state.url = action.payload;
    },
    setUrlData: (state, action) => {
      const { baseURL, queryParams, queryParamsObject } = action.payload;

      state.baseURL = baseURL;
      state.queryParams = queryParams;
      state.queryParamsObject = queryParamsObject;
      state.language = queryParamsObject?.language || EN;
    },
    resetData: () => initialState
  },
  extraReducers: builder => {
    handleAsyncActions(builder, authenticateUser);
  }
});

export const { setModalVisible, setUrl, setUrlData, resetData } = authenticationSlice.actions;
export default authenticationSlice.reducer;
