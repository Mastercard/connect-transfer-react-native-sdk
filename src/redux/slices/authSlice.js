import { createSlice } from '@reduxjs/toolkit';

import { createApiActions } from '../../services/api/routes';
import { apiKeys } from '../../services/api/apiKeys';

const initialState = {
  name: 'Connect Transfer SDK',
  loading: false,
  data: null,
  error: null
};

export const authenticateUser = createApiActions(apiKeys.authenticateUser);

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload;
    },
    clearUser: state => {
      state.name = '';
    }
  },
  extraReducers: builder => {
    builder
      .addCase(authenticateUser.pending, state => {
        state.loading = true;
        state.data = null;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.payload;
      });
  }
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
