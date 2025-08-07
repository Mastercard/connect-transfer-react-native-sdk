import { createSlice } from '@reduxjs/toolkit';

import { createApiActions } from '../../services/api/routes';
import { API_KEYS } from '../../constants';
import { handleAsyncActions } from './asyncHelper';

const initialState = {
  loading: false,
  data: null,
  error: null
};

export const termsAndPolicies = createApiActions(API_KEYS.termsAndPolicies);

const termsAndPoliciesSlice = createSlice({
  name: 'termsAndPolicies',
  initialState,
  extraReducers: builder => {
    handleAsyncActions(builder, termsAndPolicies);
  }
});

export default termsAndPoliciesSlice.reducer;
