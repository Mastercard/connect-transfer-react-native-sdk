import { createSlice } from '@reduxjs/toolkit';

import { createApiActions } from '../../services/api/routes';
import { apiKeys } from '../../services/api/apiKeys';
import { handleAsyncActions } from './asyncHelper';

const initialState = {
  loading: false,
  data: null,
  error: null
};

export const termsAndPolicies = createApiActions(apiKeys.termsAndPolicies);

const termsAndPoliciesSlice = createSlice({
  name: 'termsAndPolicies',
  initialState,
  extraReducers: builder => {
    handleAsyncActions(builder, termsAndPolicies);
  }
});

export default termsAndPoliciesSlice.reducer;
