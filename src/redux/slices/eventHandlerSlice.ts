import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { type ConnectTransferEventHandler } from '../../intefaces';

export interface EventHandlersState {
  eventHandler: ConnectTransferEventHandler | null;
}

const initialState: EventHandlersState = {
  eventHandler: null
};

const eventHandlerSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEventHandlers(state, action: PayloadAction<ConnectTransferEventHandler>) {
      state.eventHandler = action.payload;
    }
  }
});

export const { setEventHandlers } = eventHandlerSlice.actions;

export default eventHandlerSlice.reducer;
