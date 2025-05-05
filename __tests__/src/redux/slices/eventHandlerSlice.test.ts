import { type ConnectTransferEventHandler } from '../../../../src/containers/ConnectTransfer/transferEventConstants';
import reducer, {
  setEventHandlers,
  EventHandlersState
} from '../../../../src/redux/slices/eventHandlerSlice';

setEventHandlers;
describe('eventHandlerSlice', () => {
  const initialState: EventHandlersState = {
    eventHandler: null
  };

  it('should handle setEventHandlers', () => {
    const mockHandler: ConnectTransferEventHandler = {
      onInitializeConnectTransfer: jest.fn(),
      onTermsAndConditionsAccepted: jest.fn(),
      onLaunchTransferSwitch: jest.fn(),
      onTransferEnd: jest.fn(),
      onUserEvent: jest.fn()
    };

    const state = reducer(initialState, setEventHandlers(mockHandler));
    expect(state.eventHandler).toBe(mockHandler);
  });

  it('should return initial state for unknown action', () => {
    const state = reducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });
});
