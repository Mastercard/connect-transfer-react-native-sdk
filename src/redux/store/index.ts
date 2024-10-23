import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from '../slices';

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // Disable the serializable check to allow non-serializable data in actions/state
      serializableCheck: false
    })
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
