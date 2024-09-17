import { combineReducers } from '@reduxjs/toolkit';

import authSlice from './authSlice';

export const rootReducer = combineReducers({
  user: authSlice
});
