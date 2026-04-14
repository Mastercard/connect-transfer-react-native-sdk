import api from '../../../../src/services/apiClient';
import { authenticateUser } from '../../../../src/services/api/authenticate';
import { generateRoute, requestHeaders } from '../../../../src/services/api/routes';
import { METHODS, API_KEYS, TIMEOUT, TransferActionCodes } from '../../../../src/constants';

jest.mock('../../../../src/services/apiClient');
jest.mock('../../../../src/services/api/routes');

describe('authenticate', () => {
  const mockDispatch = jest.fn();
  const mockGetState = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful authenticateUser API call', async () => {
    const mockResponse = { data: 'some data' };
    api.mockResolvedValue(mockResponse);

    const action = authenticateUser(API_KEYS.authenticateUser);
    await action(mockDispatch, mockGetState, undefined);

    expect(api).toHaveBeenCalledWith({
      url: generateRoute(API_KEYS.authenticateUser, mockGetState()),
      headers: requestHeaders(API_KEYS.authenticateUser, mockGetState()),
      method: METHODS.POST,
      signal: expect.any(Object)
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: `${API_KEYS.authenticateUser}/pending`,
      meta: expect.objectContaining({
        requestId: expect.any(String),
        requestStatus: 'pending'
      })
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: `${API_KEYS.authenticateUser}/fulfilled`,
      payload: mockResponse,
      meta: expect.objectContaining({
        requestId: expect.any(String),
        requestStatus: 'fulfilled'
      })
    });
  });

  it('should return rejected action with error on API failure', async () => {
    const mockError = 'error';
    api.mockRejectedValue(mockError);
    generateRoute.mockReturnValue('mock-url');
    requestHeaders.mockReturnValue({ Authorization: 'Bearer token' });

    const thunk = authenticateUser(API_KEYS.authenticateUser);
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(api).toHaveBeenCalledWith({
      url: 'mock-url',
      headers: { Authorization: 'Bearer token' },
      method: METHODS.POST,
      signal: expect.any(Object)
    });

    expect(result.type).toBe(`${API_KEYS.authenticateUser}/rejected`);
    expect(result.payload).toBe(mockError);
    expect(result.meta.rejectedWithValue).toBe(true);
  });

  it('should abort and return API timeout when the request is canceled by timeout', async () => {
    jest.useFakeTimers();

    let rejectRequest;
    api.mockImplementation(
      () =>
        new Promise((_, reject) => {
          rejectRequest = reject;
        })
    );
    generateRoute.mockReturnValue('mock-url');
    requestHeaders.mockReturnValue({ Authorization: 'Bearer token' });

    const thunk = authenticateUser(API_KEYS.authenticateUser);
    const resultPromise = thunk(mockDispatch, mockGetState, undefined);

    jest.advanceTimersByTime(TIMEOUT);

    expect(api.mock.calls[0][0].signal.aborted).toBe(true);

    rejectRequest({
      toJSON: () => ({ code: 'ERR_CANCELED' })
    });

    const result = await resultPromise;

    expect(result.type).toBe(`${API_KEYS.authenticateUser}/rejected`);
    expect(result.payload).toEqual({ code: TransferActionCodes.API_TIMEOUT });
    expect(result.meta.rejectedWithValue).toBe(true);

    jest.useRealTimers();
  });
});
