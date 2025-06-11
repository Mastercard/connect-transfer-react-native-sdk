import reducer, {
  setEventHandlers,
  EventHandlersState
} from '../../../../src/redux/slices/eventHandlerSlice';
import { eventHandlers } from '../../ConnectTransfer.test';

describe('eventHandlerSlice', () => {
  const initialState: EventHandlersState = {
    eventHandler: null
  };

  it('should handle setEventHandlers', () => {
    const state = reducer(initialState, setEventHandlers(eventHandlers));
    expect(state.eventHandler).toBe(eventHandlers);
  });

  it('should return initial state for unknown action', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });
});
