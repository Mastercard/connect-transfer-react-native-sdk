import { createAsyncThunk } from '@reduxjs/toolkit';

import api from '../apiClient';
import { generateRoute, requestHeaders } from './routes';
import { METHODS, TIMEOUT, TransferActionCodes } from '../../constants';

export const authenticateUser = key => {
  return createAsyncThunk(key, async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const url = generateRoute(key, state);
    const headers = requestHeaders(key, state);
    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort(); // cancel the request after timeout
    }, TIMEOUT);

    try {
      const response = await api({
        url,
        headers,
        method: METHODS.POST,
        signal: controller.signal // pass abort signal to axios
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      const { code, message } = error.toJSON?.() || {};
      const apiTimeout = code === 'ERR_CANCELED' || message === 'canceled';

      if (apiTimeout) {
        return rejectWithValue({ code: TransferActionCodes.API_TIMEOUT });
      }
      clearTimeout(timeoutId);

      return rejectWithValue(error);
    }
  }).call();
};
