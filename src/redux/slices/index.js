import { combineReducers } from '@reduxjs/toolkit';

import authenticationSlice from './authenticationSlice';
import completeSlice from './completeSlice';
import termsAndPoliciesSlice from './termsAndPoliciesSlice';

export const rootReducer = combineReducers({
  user: authenticationSlice,
  termsAndPolicies: termsAndPoliciesSlice,
  complete: completeSlice,
});
